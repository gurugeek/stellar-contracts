import PropTypes from 'prop-types'
import {getContext} from 'recompose'
import sdk from 'stellar-sdk'

const keypairReadable = keypair => {
  return {publicKey: keypair.publicKey(), secret: keypair.secret()}
}

const isSignedIn = ({signer}) =>
  signer && sdk.StrKey.isValidEd25519SecretSeed(signer)

const accountExists = async (publicKey, server) => {
  let exists
  try {
    await server.loadAccount(publicKey)
    exists = true
  } catch (e) {
    if (e instanceof sdk.NotFoundError) {
      exists = false
    } else {
      console.error(e)
      throw new Error(e.msg)
    }
  }
  return exists
}

const storageInit = () => {
  let storage
  if (typeof localStorage === 'undefined' || localStorage === null) {
    const tmpdir = require('os').tmpdir
    const join = require('path').join
    const storagePath = join(tmpdir(), 'steexp')
    const LocalStorage = require('node-localstorage').LocalStorage
    storage = new LocalStorage(storagePath)
  } else {
    storage = localStorage
  }
  return storage
}

const stampMemo = () => sdk.Memo.text('Created using: git.io/v7b6s')

const memberList = (accArr, weightsArr) =>
  accArr.map((acc, idx) => {
    const haveWeights = weightsArr && weightsArr.length === accArr.length
    return {account: acc, weight: haveWeights ? weightsArr[idx] : 1}
  })

const signerObj = (key, weight) => {
  return {weight: weight, type: 'ed25519_public_key', key: key, public_key: key}
}

const thresholdsObj = (low, med, high) => {
  return {
    low_threshold: low,
    med_threshold: med,
    high_threshold: high,
  }
}

// @see App.js which puts this stellar server handle on the context
const withServer = getContext({server: PropTypes.object})
const withSigner = getContext({signer: PropTypes.string})

export {
  accountExists,
  keypairReadable,
  isSignedIn,
  memberList,
  signerObj,
  stampMemo,
  storageInit,
  thresholdsObj,
  withServer,
  withSigner,
}
