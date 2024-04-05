import { getFirestore, collection, CollectionReference, query, where, getDocs } from '@firebase/firestore/lite'

import { post, Post } from './models.js'
import { app } from './firebase.js'

const firestore = getFirestore(app)
const postsRef = collection(firestore, post.path.replace('/{postId}', '')) as CollectionReference<Post>

const renderPosts = async () => {
  const docs = await getDocs(query(postsRef, where('status', '==', 'published')))
  console.log(docs.docs)
}

renderPosts()
