import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import 'firebase/firestore'

export const setupFirestore = async (rulesets: string, userId: string = '1') => {
  // @ts-ignore
  process.env.GCLOUD_PROJECT = 'fiarcms'
  // @ts-ignore
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'

  const rules = await initializeTestEnvironment({
    projectId: 'fiarcms',
    firestore: {
      rules: `rules_version = '2';
              service cloud.firestore {
                match /databases/{database}/documents {
                  ${rulesets}
                }
              }`,
    },
  })

  return rules.authenticatedContext(userId).firestore()
}
