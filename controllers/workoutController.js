const Workout = require('../models/workoutModel')
const mongoose= require ('mongoose')

//get all workouts
const getWorkouts = async(req,res)=>{
    const user_id = req.user._id;
    const workouts = await Workout.find({
        //blank bcoz we have to get all workouts
        user_id
    }).sort({createdAt: -1})
    //-1 bcoz of arranging it in newest first order
    res.status(200).json(workouts)
}

//get a single workout
    const getWorkout = async(req,res) =>{
        const {id} = req.params

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error:'No Such Workout'})
        }

        const workout = await Workout.findById(id)

        if(!workout){
            //return bcoz we want to quit it right herre
            return res.status(404).json({error:'no such workout'})
        }

        res.status(200).json(workout)

    }

//create a new workout

const createWorkout = async(req,res) =>{
    const {title,reps,weight} = req.body
    let emptyFields = []
    if(!title){
        emptyFields.push('title')
    }
    if(!reps){
        emptyFields.push('reps')
    }
    if(!weight){
        emptyFields.push('weight')
    }
    if(emptyFields.length >0){
        return res.status(400).json({error:"Please fill in all the fields",emptyFields})
    }
    //add doc to db
    try{
        const user_id = req.user._id;
        const workout = await Workout.create({
            title,reps,weight,user_id
        })
        res.status(200).json(workout)
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

//delete a workout
const deleteWorkout = async(req,res)=>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'No Such Workout'})
    }

    const workout = await Workout.findOneAndDelete({
        _id:id
    })

    if(!workout){
        //return bcoz we want to quit it right herre
        return res.status(404).json({error:'no such workout'})
    }

    res.status(200).json(workout)

}

//update a workout
const updateWorkout = async(req,res)=>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'No Such Workout'})
    }

    const workout = await Workout.findOneAndUpdate({
        _id:id
    },{
        ...req.body
    })

    if(!workout){
        //return bcoz we want to quit it right herre
        return res.status(404).json({error:'no such workout'})
    }

    return res.status(200).json(workout)
}


module.exports = {
    createWorkout,
    getWorkout,
    getWorkouts,
    deleteWorkout,
    updateWorkout
}