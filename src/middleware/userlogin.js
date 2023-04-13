export const userLogin = async (req,res,next)=>{
  const {email,password} = req.body;

  if(!email){
    return res.status(400).json({message:"email required"});
  }
  if(!password){
    return res.status(400).json({message:"password required"});
  }

  if (email !== "") {
  if (password !== "") {
  next();
  }else{
    return res.status(400).json({message:"password can't be empty"});
  }
  }else{
    return res.status(400).json({message:"email can't be empty"});
  }
}