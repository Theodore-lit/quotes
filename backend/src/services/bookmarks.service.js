import {Bookmark} from '../models/Bookmark.model.js'

export async function createBookmark(payload) {
  return Bookmark.create(payload);
}

export async function deleteBookmarkById(id) {
  return Bookmark.findByIdAndDelete(id);
}

export async function getByUserId(id, quote){
  return Bookmark.find({user: id, quote: quote})
}