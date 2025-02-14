const yup = require("yup");
const { validSubreddit } = require("../../../../lib/util/regex");
const { sum } = require("../../../../lib/util/math");

const MediaType = {
  Picture: "PICTURE",
  Gif: "GIF",
  Video: "VIDEO",
};

const StrokeStyles = [
  "dominant",
  "nondominant",
  "headOnly",
  "shaftOnly",
  "overhandGrip",
  "bothHands",
  "handsOff",
];

const AvailableTasks = [
  "doubleStrokes",
  "halvedStrokes",
  "teasingStrokes",
  "accelerationCycles",
  "randomBeat",
  "randomStrokeSpeed",
  "redLightGreenLight",
  "clusterStrokes",
  "gripChallenge",
  "dominant",
  "nondominant",
  "headOnly",
  "shaftOnly",
  "overhandGrip",
  "bothHands",
  "handsOff",
  "bindCockBalls",
  "rubberBands",
  "ballSlaps",
  "squeezeBalls",
  "headPalming",
  "icyHot",
  "toothpaste",
  "breathPlay",
  "scratching",
  "flicking",
  "cbtIce",
  "clothespins",
  "precum",
  "buttplug",
  "rubNipples",
  "nipplesAndStroke",
];

const MAX_GAME_DURATION = 60 * 12; // 12 hours

const GAME_CONFIG_SCHEMA = yup
  .object()
  .required()
  .shape({
    redgifs: yup
      .array()
      .of(
        yup
          .string()
          .trim()
          .lowercase()
          .required()
          .min(
            3,
            ({ value, min }) =>
              `Redgif tags '${value}' cannot be shorter than ${min} characters.`,
          )
          .max(
            21,
            ({ value, max }) =>
              `Redgif tags '${value}' cannot be longer than ${max} characters.`,
          )
          .matches(
            validSubreddit,
            ({ value }) => `Redgif tag '${value}' is an invalid name.`,
          ),
      )
      .dedupe()
      .unique()
      .max(10, ({ max }) => `Cannot specify more than ${max} Redgif tags.`),
    subreddits: yup
      .array()
      .of(
        yup
          .string()
          .trim()
          .lowercase()
          .required()
          .min(
            3,
            ({ value, min }) =>
              `Subreddit  '${value}' cannot be shorter than ${min} characters.`,
          )
          .max(
            21,
            ({ value, max }) =>
              `Subreddit '${value}' cannot be longer than ${max} characters.`,
          )
          .matches(
            validSubreddit,
            ({ value }) => `Subreddit '${value}' is an invalid name.`,
          ),
      )
      .dedupe()
      .unique()
      .max(200, ({ max }) => `Cannot specify more than ${max} subreddits.`),
    actionFrequency: yup
      .number()
      .required()
      .min(0)
      .max(
        MAX_GAME_DURATION,
        "Action frequency cannot be greater than 12 hours.",
      ),
    slideDuration: yup
      .number()
      .required()
      .min(
        3,
        ({ min }) =>
          `Minimum slide duration cannot be shorter than ${min} seconds.`,
      )
      .max(
        MAX_GAME_DURATION,
        "Maximum slide duration cannot be greater than 12 hours.",
      ),
    imageType: yup
      .array()
      .required()
      .min(1, "One media type must be selected.")
      .of(yup.string().oneOf(Object.values(MediaType)))
      .unique(),
    gameDuration: yup
      .object()
      .default(undefined)
      .required()
      .shape({
        min: yup
          .number()
          .min(
            1,
            ({ min }) => `Game duration cannot be shorter than ${min} minute.`,
          ),
        max: yup
          .number()
          .min(
            yup.ref("min"),
            "Maximum game duration must be greater than the minimum game duration.",
          )
          .max(
            MAX_GAME_DURATION,
            "Maximum game duration cannot be greater than 12 hours.",
          ),
      }),
    postOrgasmTorture: yup.boolean().required(),
    postOrgasmTortureDuration: yup
      .object()
      .default(undefined)
      .required()
      .shape({
        min: yup
          .number()
          .required()
          .min(0, "Minimum post orgasm time cannot be less than 0."),
        max: yup
          .number()
          .required()
          .min(
            yup.ref("min"),
            "Maximum post orgasm torture duration must be greater than minimum duration.",
          )
          .max(
            MAX_GAME_DURATION,
            "Maximum post orgasm torture duration cannot exceed 12 hours.",
          ),
      }),
    ruinedOrgasms: yup
      .object()
      .default(undefined)
      .required()
      .shape({
        min: yup
          .number()
          .required()
          .min(0, "Minimum ruined orgasms cannot be less than 0."),
        max: yup
          .number()
          .required()
          .min(
            yup.ref("min"),
            "Maximum ruined orgasms cannot exceed the minimum ruined orgasms.",
          ),
      }),
    strokeSpeed: yup
      .object()
      .default(undefined)
      .required()
      .shape({
        min: yup
          .number()
          .required()
          .min(0, "Minimum stroke speed cannot be less than 0."),
        max: yup
          .number()
          .required()
          .max(8, ({ max }) => `Maximum stroke speed cannot exceed ${max}.`)
          .min(
            yup.ref("min"),
            "Maximum stroke speed cannot exceed the minimum stroke speed.",
          ),
      }),
    gripAdjustments: yup.boolean().required(),
    initialGripStrength: yup
      .number()
      .required()
      .min(0, "The initial grip strength cannot be less than 0.")
      .max(6, ({ max }) => `The initial grip strength cannot exceed ${max}.`),
    defaultStrokeStyle: yup
      .string()
      .required()
      .oneOf(StrokeStyles),
    minimumEdges: yup
      .number()
      .required()
      .min(0, "Minimum edges cannot be less than 0.")
      .max(1000, ({ max }) => `The number of edges cannot exceed ${max}.`),
    orgasms: yup
      .object()
      .default(undefined)
      .required()
      .shape({
        min: yup
          .number()
          .required()
          .min(0, "Minimum number of orgasms cannot be less than 0."),
        max: yup
          .number()
          .required()
          .max(
            50,
            ({ max }) => `Maximum number of orgasms cannot exceed ${max}.`,
          )
          .min(
            yup.ref("min"),
            "Maximum number of orgasms must be greater than the minimum number of orgasms.",
          ),
      }),
    ruinCooldown: yup
      .number()
      .required()
      .min(0)
      .max(
        MAX_GAME_DURATION,
        "Maximum ruined cooldown duration cannot exceed 12 hours.",
      ),
    edgeCooldown: yup
      .number()
      .required()
      .min(0)
      .max(
        MAX_GAME_DURATION,
        "Maximum ruined cooldown duration cannot exceed 12 hours.",
      ),
    edgeFrequency: yup
      .number()
      .required()
      .min(0)
      .max(100, "Edge frequency cannot exceed 100%"),
    finaleProbabilities: yup
      .object()
      .default(undefined)
      .required()
      .shape({
        orgasm: yup
          .number()
          .required()
          .min(0)
          .max(100),
        denied: yup
          .number()
          .required()
          .min(0)
          .max(100),
        ruined: yup
          .number()
          .required()
          .min(0)
          .max(100),
      })
      .test(
        "probability-sum",
        "The sum of all probabilities should match 100%",
        function() {
          const { finaleProbabilities } = this.parent;

          return sum(Object.values(finaleProbabilities)) === 100;
        },
      ),
    tasks: yup
      .array()
      .min(0, "Selected tasks cannot be below 0.")
      .of(yup.string().oneOf(AvailableTasks))
      .unique(),
  });
module.exports = {
  GAME_CONFIG_SCHEMA,
};
