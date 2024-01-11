"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupFirestore = void 0;
const rules_unit_testing_1 = require("@firebase/rules-unit-testing");
require("firebase/firestore");
const setupFirestore = async (rulesets, userId = '1') => {
    // @ts-ignore
    process.env.GCLOUD_PROJECT = 'fiarcms';
    // @ts-ignore
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    const rules = await (0, rules_unit_testing_1.initializeTestEnvironment)({
        projectId: 'fiarcms',
        firestore: {
            rules: `rules_version = '2';
              service cloud.firestore {
                match /databases/{database}/documents {
                  ${rulesets}
                }
              }`,
        },
    });
    return rules.authenticatedContext(userId).firestore();
};
exports.setupFirestore = setupFirestore;
