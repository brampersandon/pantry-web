import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  // REDACTED
};

export const initialize = () => {
  return firebase.initializeApp(firebaseConfig)
}

export type FirebaseApp = firebase.app.App
export type FirebaseUser = firebase.User

// Firestore Types
export type DocumentData = firebase.firestore.DocumentData
export type DocumentChange = firebase.firestore.DocumentChange
export type DocumentReference = firebase.firestore.DocumentReference
export type Query = firebase.firestore.Query
export type QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot
export type QuerySnapshot = firebase.firestore.QuerySnapshot
export type Timestamp = firebase.firestore.Timestamp

export const toDate = (ts: firebase.firestore.Timestamp) => {
  return ts.toDate()
}

export const toTimestamp = (date: Date) => {
  return firebase.firestore.Timestamp.fromDate(date)
}