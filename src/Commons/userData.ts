export interface ChannelData{
    id:number,
    channelName:string,
    channelDescription:string,
    gitHubLink:string,
    twitterLink:string,
    websiteLink:string,
    channelPicURL:string,
    subscribersCount:number,
    banner:Banner,
    verified:true,
    channelStatus:ChannelStatus,
    videos: Video[] | null
    playlists: Playlist[] | null
}
interface Banner{
    id:number,
    bannerHead:string,
    bannerPicUrl:string,
    bannerDescription:string
}
interface ChannelStatus{
    id:number,
    country:string,
    joinedDate:string,
    totalViews:number
}

export interface Video{
    id:number,
    likes:number,
    channelId:number,
    dislikes:number,
    views:number,
    tile:string,
    description:string,
    duration:string,
    uploadDateTime:string,
    videoCategory:string,
    videoChannelName:string,
    videoUrl:string,
    videoThumbnail:string,
    comments: Comment[] | null
}

export interface Comment{
    id:number,
    username:string,
    userPicURL:string,
    commentData:string,
    timestamp:string,
    userChannelId:number,
    likes:string,
    disLikes:string,
    replies: CommentReply[] | []
}

export interface CommentReply{
    id:number,
    username:string,
    userPicURL:string,
    userChannelId:number,
    timestamp:string,
    commentData:string,
    likes:number,
    disLikes:number
}

interface Playlist{
    id:number,
    name:string,
    description:string,
    videos: Video[] | null;
}

export interface UserData{
    id:number,
    email:string,
    username:string,
    password?:string,
    avatar?:string,
    channel?:ChannelData | null,
    provider?:string
}

export interface SubscriptionElement{
    channelId:number,
    channelPicURL:string,
    channelName:string,
    subscriberCount:number,
    videosCount:number
}

export interface GroupedVideos {
    today: Video[];
    yesterday: Video[];
    thisWeek: Video[];
    thisMonth: Video[];
    older: Video[];
  }