const User = require("../model/User");

class AttackController {
  static randomSuccess(ourAttacker, enemyDefender) {
    const arr = [];
    for (let i = 0; i < 3; i++) {
      arr.push(Math.random() < ourAttacker / (enemyDefender + 1));
    }
    return arr.filter((el) => el).length >= 2 ? true : false;
  }

  static attack(req, res, next) {
    // res.status(200).json({msg: 'ATTACK!'});
    const ourAttacker = req.body.soldiers;
    const enemyDefenderId = req.params.id;
    let attacker;
    let defender;
    let isSuccess;
    User.findById(req._userId)
      .then((user) => {
        if (user) {
          attacker = user;
          return User.findById({ _id: enemyDefenderId });
        } else {
          throw "USER_NOT_FOUND";
        }
      })
      .then((user) => {
        if (user) {
          defender = user;
          if (attacker.resources.soldiers >= ourAttacker) {
            const resources = attacker.resources;
            resources.soldiers = attacker.resources.soldiers - ourAttacker;
            // return true;
            return User.findOneAndUpdate({ _id: attacker._id }, { resources }); // user
          } else {
            throw {name: "NOT_ENOUGH"};
          }
        } else {
          throw {name: "USER_NOT_FOUND"};
        }
      })
      .then((_) => {
        isSuccess = AttackController.randomSuccess(
          ourAttacker,
          defender.resources.soldiers
        );
        // console.log(defender.resources.soldiers)
        if(defender.resources.soldiers >= 50){
          if (isSuccess) {
            // attacker win
            const newMedals = attacker.medals + 5;
            const resources = attacker.resources;
            resources.golds =
              resources.golds + Math.floor(defender.resources.golds / 2);
            resources.foods =
              resources.foods + Math.floor(defender.resources.foods / 2);
            //   resources.soldiers = attacker.soldiers - ourAttacker;
            return User.findOneAndUpdate(
              { _id: attacker._id },
              { medals: newMedals, resources }
            );
          } else {
            // attacker lose
            const newMedals = Math.floor(attacker.medals / 2);
            return User.findOneAndUpdate(
              { _id: attacker._id },
              { medals: newMedals }
            );
          }
        }else throw {name: "PROHIBITED_ATTACK"}
      })
      .then((_) => {
        if (!isSuccess) {
          // defender win
          return User.findOneAndUpdate(
            { _id: defender._id },
            { medals: defender.medals + 2 }
          );
        } else {
          // defender lose
          const resources = defender.resources;
          resources.foods = Math.ceil(defender.resources.foods / 2);
          resources.golds = Math.ceil(defender.resources.golds / 2);
          resources.soldiers = 0;
          return User.findOneAndUpdate({ _id: defender._id }, { resources });
        }
      })
      .then((_) => {
        res.status(200).json({
          success: true,
          message: `Invade ${isSuccess ? "Success" : "Fail"}`,
        });
      })
      .catch(next);
  }
}

module.exports = AttackController;