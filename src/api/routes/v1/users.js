const createError = require("http-errors");
const { Router } = require("express");
const { GAME_FILTER_SCHEMA } = require("./games");
const gameDb = require("lib/db/game-config");
const gameHistoryDb = require("lib/db/game-history");
const profileDb = require("lib/db/profile");
const paginate = require("api/middleware/paginate");
const sortable = require("api/middleware/sortable");
const validate = require("api/middleware/validate");

const router = Router();

router.get("/:userId/profile", async (req, res, next) => {
  const { userId } = req.params;

  if (userId !== req.user.sub) {
    return next(createError.Forbidden());
  }

  const profile = await profileDb.findById(userId);
  if (!profile) {
    return next(createError.NotFound());
  }

  res.send(profile);
});

router.post("/:userId/profile", async (req, res, next) => {
  const { userId } = req.params;

  const profile = await profileDb.findById(userId);
  if (profile) {
    return next(createError.Conflict("Profile already exists"));
  }
  await profileDb.create(userId);

  res.redirect(303, "profile");
});

router.put("/:userId/games/history/:gameId", async (req, res, next) => {
  const { userId, gameId } = req.params;

  if (userId !== req.user.sub) {
    return next(createError.Forbidden());
  }

  gameHistoryDb.append(gameId, userId);

  res.sendStatus(204);
});

router.get(
  "/:userId/games/history",
  paginate,
  validate(GAME_FILTER_SCHEMA),
  sortable(["title", "updatedAt"]),
  async (req, res, next) => {
    const { userId } = req.params;
    const paginate = req.paginate;
    const sort = req.sort;
    const filters = req.query;

    if (userId !== req.user.sub) {
      return next(createError.Forbidden());
    }

    const games = await gameDb.findHistory(userId, paginate, filters, sort);

    res.send(games);
  },
);

module.exports = router;
