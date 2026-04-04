import {Like} from '../models/Like.model.js'

export async function createLike(payload) {
  return Like.create(payload);
}

export async function deleteLikeById(id) {
  return Like.findByIdAndDelete(id);
}

export async function getByUserId(id, quote){
  return Like.find({user: id, quote: quote})
}