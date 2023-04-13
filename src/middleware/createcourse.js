export const createcourse_middleware = async (req,res,next)=>{
    const {name,code,description,duration_per_week,location,time,course_media_url,course_group} = req.body;
  
    if(!name){
      return res.status(400).json({message:"name required"});
    }
    if(!code){
      return res.status(400).json({message:"code required"});
    }
    if(!description){
        return res.status(400).json({message:"description required"});
      }
      if(!duration_per_week){
        return res.status(400).json({message:"duration_per_week required"});
      }
      if(!location){
        return res.status(400).json({message:"location required"});
      }
      if(!time){
        return res.status(400).json({message:"time required"});
      }
      if(!course_media_url){
        return res.status(400).json({message:"course_media_url required"});
      }
      if(!course_group){
        return res.status(400).json({message:"course_group required"});
      }
     
     
      next();
  
    
  }