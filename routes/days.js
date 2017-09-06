const app = require('express').Router();
const db = require('../db');
const { Day, Hotel, Restaurant, Activity, Place } = db.models;

app.get('/', (req, res, next)=> {
  Day.findAll({
    order: [ 'id' ],
    include: [
      { model: Hotel, include: [ Place ] },
      { model: Restaurant, include: [ Place ] },
      { model: Activity, include: [ Place ] }
    ]
  })
  .then( days => {
    res.send(days);
  })
  .catch(next);
});

app.post('/', (req, res, next)=> {
  Day.create({})
    .then( day => {
      res.send(day);
    });
});

app.delete('/:id', (req, res, next)=> {

  Day.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(function(){
    res.send(req.params.id);
  })
});

//TO DO - total of six routes, add and remove hotels, restaurants, activities for a day

app.post('/:dayId/restaurants/:id', (req, res, next)=> {
  Promise.all([
    Day.findById(req.params.dayId * 1),
    Restaurant.find({
      where:{
        id: req.params.id * 1
      },
      include: [Place]
    })
  ])
    .then( ([day, restaurant]) => {
      day.addRestaurants(restaurant)
      .then(() => {
        res.send(restaurant);
      });
    })
});

app.delete('/:dayId/restaurants/:id', (req, res, next)=> {
  Promise.all([
    Day.findById(req.params.dayId * 1),
    Restaurant.find({
      where:{
        id: req.params.id * 1
      },
      include: [Place]
    })
  ])
    .then( ([day, restaurant]) => {
      day.removeRestaurants(restaurant)
      .then(() => {
        res.send(restaurant);
      });
    })
});

//hotels

app.post('/:dayId/hotels/:id', (req, res, next)=> {
  Promise.all([
    Day.findById(req.params.dayId * 1),
    Hotel.find({
      where:{
        id: req.params.id * 1
      },
      include: [Place]
    })
  ])
    .then( ([day, hotel]) => {
      day.addHotels(hotel)
      .then(() => {
        res.send(hotel);
      });
    })
});

app.delete('/:dayId/hotels/:id', (req, res, next)=> {
  Promise.all([
    Day.findById(req.params.dayId * 1),
    Hotel.find({
      where:{
        id: req.params.id * 1
      },
      include: [Place]
    })
  ])
    .then( ([day, hotel]) => {
      day.removeHotels(hotel)
      .then(() => {
        res.send(hotel);
      });
    })
});

// activities
app.post('/:dayId/activities/:id', (req, res, next)=> {
  Promise.all([
    Day.findById(req.params.dayId * 1),
    Activity.find({
      where:{
        id: req.params.id * 1
      },
      include: [Place]
    })
  ])
    .then( ([day, activity]) => {
      day.addActivities(activity)
      .then(() => {
        res.send(activity);
      });
    })
});

app.delete('/:dayId/activities/:id', (req, res, next)=> {
  Promise.all([
    Day.findById(req.params.dayId * 1),
    Activity.find({
      where:{
        id: req.params.id * 1
      },
      include: [Place]
    })
  ])
    .then( ([day, activity]) => {
      day.removeActivities(activity)
      .then(() => {
        res.send(activity);
      });
    })
});
module.exports = app;
