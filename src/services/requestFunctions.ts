import { ca, tr } from 'date-fns/locale';
import { AuthenticationData } from '../Commons/authData'
import { LoginData } from '../Commons/LoginData';
import { ChannelData, Comment, SubscriptionElement, UserData, Video } from '../Commons/userData'
import { myAxios } from './myAxios';
import { AxiosProgressEvent } from 'axios';

export const signUp = async(data:AuthenticationData):Promise<UserData|string> =>{
    try{
        const response = await myAxios.post<UserData>("/register",data);
        return response.data;
    }catch(e){
        console.log(e);
        return "";
    }
}
export interface TokenData {
    token: string;
}

export const loginIn = async(data: LoginData) :Promise<TokenData|string> =>{
    try{
        const response = await myAxios.post<TokenData>("/login",data);
        return response.data;
    }catch(e){
        console.log(e);
        return "";
    }
}

export const getUserFromToken = async():Promise<UserData|null> =>{
    try{
        const response = await myAxios.get<UserData>("/get-user");
        return response.data;
    }catch(e){
        console.log(e);
        return null;
    }
}

export const getUserFromEmail = async(data:{}):Promise<UserData|null> =>{
    try{
        const response = await myAxios.post<UserData>("/get-user-by-email",data);
        return response.data;
    }catch(e){
        console.log(e);
        return null;
    }
}

export const uploadVideo = async (
    formData: FormData,
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<string | null> => {
    try {
      const response = await myAxios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      });
      return response.data;
    } catch (e) {
      console.error("Upload failed:", e);
      return null;
    }
  };
  
export const getAllChannelVideos = async(id:number):Promise<[] | null> => {
    try{
        console.log("HERERRE")
        const response = await myAxios.post("/api/get-all-Channel-videos",id);
        return response.data;
    }catch(e){
        console.log(e)
        return null;
    }
}

export const getAllVideos = async():Promise<Video[] | null> =>{
    try{
        const response = await myAxios.get("/api/getAllVideos");
        return response.data;
    }catch(e){
        console.log(e);
        return null;
    }
}

export const getVideoById = async(id:number):Promise<Video | null> => {
    try{
        const response = await myAxios.get(`/api/get-video-by-id/${id}`);
        return response.data;
    }catch(e){
        console.log(e);
        return null;
    }
}

export const getAllVideosExceptSelf = async(id:number):Promise<Video[] | null> =>{
    try{
        const response = await myAxios.get(`/api/get-all-video-except-self/${id}`);
        return response.data;
    }catch(e){
        console.log(e);
        return null;
    }
}

export const increaseVideoViews = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post(`/api/increase-view`,formData);
    }catch(e){
        console.log(e);
    }
}
export const checkIsLiked = async (formData:FormData):Promise<boolean> =>{
    try{
        const response = await myAxios.post<boolean>("/api/check-liked",formData);
        return response.data;
    }catch(e){
        console.log(e);
        return false;
    }
}

export const checkIsDisliked = async (formData:FormData):Promise<boolean> =>{
    try{
        const response = await myAxios.post<boolean>("/api/check-disliked",formData);
        return response.data;
    }catch(e){
        console.log(e);
        return false;
    }
}

export const increaseVideoLikes = async (formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("api/increase-like",formData);
    }catch(e){
        console.log(e);
    }
}

export const decreaseVideoLikes = async (formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("api/decrease-like",formData);
    }catch(e){
        console.log(e);
    }
}

export const increaseVideoDislikes = async (formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("api/increase-dislike",formData);
    }catch(e){
        console.log(e);
    }
}

export const decreaseVideoDislikes = async (formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("api/decrease-dislike",formData);
    }catch(e){
        console.log(e);
    }
}

export const getLikeCount = async(videoId:number):Promise<number> => {
    try{
        const response = await myAxios.get(`api/get-like-count/${videoId}`);
        return response.data;
    }catch(e){
        console.log(e);
        return 0;
    }
}

export const getDislikeCount = async(videoId:number):Promise<number> => {
    try{
        const response = await myAxios.get(`api/get-dislike-count/${videoId}`);
        return response.data;
    }catch(e){
        console.log(e);
        return 0;
    }
}

export const setChannelBanner = async(formData:FormData):Promise<string | null> =>{
    try{
        const response = await myAxios.post("/api/update-banner-pic",formData,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data; 
    }catch(e){
        console.log(e);
        return null;
    }
}

export const setChannelProfile = async(formData:FormData):Promise<string | null> =>{
    try{
        const response = await myAxios.post("/api/update-profile-pic",formData,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data; 
    }catch(e){
        console.log(e);
        return null;
    }
}


export const setChannelAbout = async(formData:FormData):Promise<string | null> =>{
    try{
        const response = await myAxios.post("/api/update-about",formData);
        return response.data; 
    }catch(e){
        console.log(e);
        return null;
    }
}

export const subscribeToChannel = async(formData:FormData):Promise<string | null> =>{
    try{
        const response = await myAxios.post("/api/subscribe",formData);
        return response.data; 
    }catch(e){
        console.log(e);
        return null;
    }
}

export const unSubscribeToChannel = async(formData:FormData):Promise<string | null> =>{
    try{
        const response = await myAxios.post("/api/unsubscribe",formData);
        return response.data; 
    }catch(e){
        console.log(e);
        return null;
    }
}

export const checkIsSubcribed = async(formData:FormData):Promise<string | null> =>{
    try{
        const response = await myAxios.post("/api/check-subscribe",formData);
        return response.data; 
    }catch(e){
        console.log(e);
        return null;
    }
}

export const getVideoChannelPic = async(channelId:number):Promise<string | null> =>{
    try{
        const response = await myAxios.get(`/api/get-video-channel-pic/${channelId}`);
        return response.data; 
    }catch(e){
        console.log(e);
        return null;
    }
}

export const getVideoChannelSubCount = async(channelId:number):Promise<number | null> =>{
    try{
        const response = await myAxios.get(`/api/get-sub-count/${channelId}`);
        return response.data; 
    }catch(e){
        console.log(e);
        return null;
    }
}

export const getSubscriptions = async(channelId:number):Promise<SubscriptionElement[] | null> =>{
    try{
        const response = await myAxios.get(`/api/get-subscriptions/${channelId}`);
        return response.data; 
    }catch(e){
        console.log(e);
        return null;
    }
}

export const getLikedVideos = async(channelId:number):Promise<Video[] | null> =>{
    try{
        const response = await myAxios.get(`/api/get-liked-videos/${channelId}`);
        return response.data; 
    }catch(e){
        console.log(e);
        return null;
    }
}

export const getLatestVideos = async(channelId:number):Promise<Video[] | null> =>{
    try{
        const response = await myAxios.get(`/api/get-subscription-videos/${channelId}`);
        return response.data; 
    }catch(e){
        console.log(e);
        return null;
    }
}

export const setChannelHistory = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("/api/set-video-to-history",formData);
    }catch(e){
        console.log(e);
    
    }
}

export const getChannelHistory = async(channelId:number):Promise<Video[] | null> =>{
    try{
        const response = await myAxios.get(`/api/get-channel-history/${channelId}`);
        return response.data; 
    }catch(e){
        console.log(e);
        return null;
    }
}

export const postVideoComment = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("/api/post-comment",formData);
    }catch(e){
        console.log(e);
    
    }
}

export const getVideoComments = async(videoId:number):Promise<Comment[] | null> =>{
    try{
        const response = await myAxios.get(`/api/load-comments/${videoId}`);
        return response.data; 
    }catch(e){
        console.log(e);
        return null;
    }
}

export const deleteVideoComment = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("/api/delete-comment",formData);
    }catch(e){
        console.log(e);
    
    }
}

export const increaseCommenttLike = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("/api/increase-comment-like",formData);
    }catch(e){
        console.log(e);
    
    }
}

export const decreaseCommentLike = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("/api/decrease-comment-like",formData);
    }catch(e){
        console.log(e);
    
    }
}

export const increaseCommentDislike = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("/api/increase-comment-dislike",formData);
    }catch(e){
        console.log(e);
    
    }
}

export const decreaseCommentDislike = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("/api/decrease-comment-dislike",formData);
    }catch(e){
        console.log(e);
    
    }
}

export const checkIsCommentLiked = async(formData:FormData):Promise<boolean> =>{
    try{
        const response = await myAxios.post("/api/check-comment-liked",formData);
        return response.data;
    }catch(e){
        console.log(e);
        return false;
    }
}

export const checkIsCommentDisliked = async(formData:FormData):Promise<boolean> =>{
    try{
        const response = await myAxios.post("/api/check-comment-disliked",formData);
        return response.data;
    }catch(e){
        console.log(e);
        return false;
    }
}

export const postCommentReply = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("/api/post-comment-reply",formData);
    }catch(e){
        console.log(e);
    
    }
}

export const deleteCommentReply = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("/api/delete-comment-reply",formData);
    }catch(e){
        console.log(e);
    
    }
}

export const checkIsCommentReplyLiked = async(formData:FormData):Promise<boolean> =>{
    try{
        const response = await myAxios.post("/api/check-comment-reply-liked",formData);
        return response.data;
    }catch(e){
        console.log(e);
        return false;
    }
}

export const checkIsCommentReplyDisliked = async(formData:FormData):Promise<boolean> =>{
    try{
        const response = await myAxios.post("/api/check-comment-reply-disliked",formData);
        return response.data;
    }catch(e){
        console.log(e);
        return false;
    }
}

export const increaseCommentReplyLike = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("/api/increase-comment-reply-like",formData);
    }catch(e){
        console.log(e);
    
    }
}

export const decreaseCommentReplyLike = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("/api/decrease-comment-reply-like",formData);
    }catch(e){
        console.log(e);
    
    }
}

export const increaseCommentReplyDislike = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("/api/increase-comment-reply-dislike",formData);
    }catch(e){
        console.log(e);
    
    }
}

export const decreaseCommentReplyDislike = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("/api/decrease-comment-reply-dislike",formData);
    }catch(e){
        console.log(e);
    
    }
}

export async function getDownloadURL(videoId:number):Promise<string> {
    const resoponse = await myAxios.get(`/api/download-url/${videoId}`);  
    return resoponse.data
}

export const addVideoToWatchLater = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("/api/put-video-to-watch-later",formData);
    }catch(e){
        console.log(e);
    }
}

export const removeVideoFromWatchLater = async(formData:FormData):Promise<void> =>{
    try{
        await myAxios.post("/api/remove-video-from-watch-later",formData);
    }catch(e){
        console.log(e);
    }
}

export async function getWatchLaterVideos(channelId:number):Promise<Video[]> {
    const resoponse = await myAxios.get(`/api/get-watch-later-videos/${channelId}`);  
    return resoponse.data;
}

export async function getChannelById(channelId:number):Promise<ChannelData> {
    const resoponse = await myAxios.get(`/api/get-channel-by-id/${channelId}`);  
    return resoponse.data;
}

export async function getChannelVideosById(channelId:number):Promise<Video[]> {
    const resoponse = await myAxios.get(`/api/get-channel-videos-by-id/${channelId}`);  
    return resoponse.data;
}

export const subscribeToChannelPage = async(formData:FormData):Promise<string | null> =>{
    try{
        const response = await myAxios.post("/api/subscribe-channel",formData);
        return response.data; 
    }catch(e){
        console.log(e);
        return null;
    }
}

export const unSubscribeToChannelPage = async(formData:FormData):Promise<string | null> =>{
    try{
        const response = await myAxios.post("/api/unsubscribe-channel",formData);
        return response.data; 
    }catch(e){
        console.log(e);
        return null;
    }
}