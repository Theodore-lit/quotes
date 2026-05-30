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
export async function commentLikeByUser(id, comment){
  return Like.find({user: id, comment: comment}).populate("user").populate("comment")
}
export async function listLikes(){
  return Like.find().populate("user quote comment")
}