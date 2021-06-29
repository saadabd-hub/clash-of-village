const Barrack = require("../model/Barrack");
const User = require("../model/User");

class BarrackController {
  static details(req, res, next) {
    Barrack.find(
      { _userId: req._userId, buildingType: "barrack" },
      "-soldierGenerated -buildingType"
    )
      .then((barrack) => {
        res.status(200).json({
          msg: "success",
          barrack: barrack,
        });
      })
      .catch(next);
  }

  static create(req, res, next) {
    User.findById(req._userId)
      .then((user) => {
        const resources = user.resources;
        const totalbuilding = user.totalbuilding;
        if (user) {
          if (resources.golds >= 30 && resources.foods >= 30) {
            if (totalbuilding.barracks < 30) {
              return User.findOneAndUpdate(
                { _id: req._userId },
                {
                  resources: {
                    ...resources,
                    golds: (resources.golds -= 30),
                    foods: (resources.foods -= 30),
                  },
                  totalbuilding: {
                    ...totalbuilding,
                    barracks: (totalbuilding.barracks += 1),
                  },
                }
              );
            } else {
              next();
            }
          } else {
            next();
          }
        } else
        { next();
        }
      })
      .then(() => {
        const { name } = req.body;
        const barrack = new Barrack({
          _userId: req._userId,
          name,
        });
        return barrack.save();
      })
      .then((barrack) => {
        res.status(201).json({
          msg: "success " + barrack.name + " has been created.",
          data: {
            name: barrack.name,
          },
        });
      })
      .catch(next);
  }

  static getById(req, res, next) {
    Barrack.findOne({ _id: req.params.id }, "-buildingType")
      .then((barrack) => {
        res.status(200).json({ data: barrack });
      })
      .catch(next);
  }

  static update(req, res, next) {
    const { name } = req.body;
    Barrack.findOne({ _id: req.params.id })
      .then((barrack) => {
        barrack.name = name;
        return Barrack.updateOne(
          { _id: barrack._id },
          { $set: { name: barrack.name } }
        );
      })
      .then((barrack) => {
        if (barrack.nModified === 0) {
          next();
        } else {
          res.status(200).json({ message: "Barrack's name changed" });
        }
      })
      .catch(next);
  }

  static delete(req, res, next) {
    Barrack.findOne({ _id: req.params.id })
      .then((barrack) => {
        return barrack.remove();
      })
      .then((barrack) => {
        res.status(200).json({ data: { deleted: barrack } });
      })
      .catch(next);
  }

  static collect(req, res, next) {
    Barrack.findOne({ _id: req.params.id })
      .then((barrack) => {
        // console.log(barrack);
        const id = barrack._userId;
        User.findById(id)
          .then((user) => {
            const resources = user.resources;
            if (resources.soldiers >= 500) {
              resources.soldiers = 500;
            } else {
              resources.soldiers += barrack.soldierGenerated;
            }
            return User.findOneAndUpdate({ _id: user._id }, { resources });
          })
          .then((_) => {
            barrack.soldierGenerated = 0;
            return Barrack.updateOne(
              { _id: barrack._id },
              { $set: { soldierGenerated: 0 } }
            );
          })
          .then((user) => {
            if (user.nModified === 0) {
              next();
            } else {
              res.status(200).json({ message: "Collected" });
            }
          })
          .catch(next);
      })
      .catch(next);
  }
}

module.exports = BarrackController;
