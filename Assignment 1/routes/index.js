const monthlyRoutes = require("./monthlyView");
const dailyRoutes = require("./dailyView");

const constructorMethod = (app) => {
    app.use("/monthly", monthlyRoutes);
    app.use("/daily", dailyRoutes);

    app.use("*", (req, res) => {
        res.render("calender/noresource");
    })
};

module.exports = constructorMethod;