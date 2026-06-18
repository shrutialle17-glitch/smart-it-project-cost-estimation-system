const User = require("../models/User");
const Estimation = require("../models/Estimation");
const { notifyClientStatusUpdate } = require("../services/notificationService");
const { sendResponse } = require("../utils/sendResponse");

const Feature = require("../models/Feature");

const getStats = async (req, res, next) => {
  try {
    const totalClients = await User.countDocuments({ role: "client" });
    const totalEstimations = await Estimation.countDocuments();
    const revenueAgg = await Estimation.aggregate([
      { $group: { _id: null, total: { $sum: "$calculation.totalCost" } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const thisMonthEstimations = await Estimation.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const thisMonthClients = await User.countDocuments({
      role: "client",
      createdAt: { $gte: startOfMonth },
    });

    const byProjectType = await Estimation.aggregate([
      {
        $group: {
          _id: "$projectType",
          count: { $sum: 1 },
          totalValue: { $sum: "$calculation.totalCost" },
        },
      },

      {
        $lookup: {
          from: "projecttypes",
          localField: "_id",
          foreignField: "_id",
          as: "projectType",
        },
      },

      {
        $unwind: "$projectType",
      },

      {
        $project: {
          _id: 1,
          count: 1,
          totalValue: 1,
          name: "$projectType.name",
          slug: "$projectType.slug",
        },
      },

      {
        $sort: { count: -1 },
      },
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const estimationsOverTime = await Estimation.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    sendResponse(res, 200, "Admin stats retrieved", {
      totalClients,
      totalEstimations,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      thisMonthEstimations,
      thisMonthClients,
      byProjectType,
      estimationsOverTime,
    });
  } catch (error) {
    next(error);
  }
};

const getClients = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;
    const filter = { role: "client" };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }
    const total = await User.countDocuments(filter);
    const clients = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const clientsWithEstCount = await Promise.all(
      clients.map(async (client) => {
        const estCount = await Estimation.countDocuments({
          client: client._id,
        });
        return { ...client.toJSON(), estimationCount: estCount };
      }),
    );
    sendResponse(
      res,
      200,
      "Clients retrieved",
      { clients: clientsWithEstCount },
      { page, limit, total, pages: Math.ceil(total / limit) },
    );
  } catch (error) {
    next(error);
  }
};

const getClient = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client || client.role !== "client")
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    const estimations = await Estimation.find({ client: client._id }).sort({
      createdAt: -1,
    });
    sendResponse(res, 200, "Client retrieved", { client, estimations });
  } catch (error) {
    next(error);
  }
};

const getAllEstimations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, projectType } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (projectType) filter.projectType = projectType;
    const total = await Estimation.countDocuments(filter);
    const estimations = await Estimation.find(filter)
      .populate("client", "name email company")
      .populate("projectType", "name slug icon")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    sendResponse(
      res,
      200,
      "Estimations retrieved",
      { estimations },
      { page, limit, total, pages: Math.ceil(total / limit) },
    );
  } catch (error) {
    next(error);
  }
};

const updateEstimationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["draft", "saved", "sent", "accepted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }
    const estimation = await Estimation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).populate("client", "name email");
    if (!estimation)
      return res
        .status(404)
        .json({ success: false, message: "Estimation not found" });
    await notifyClientStatusUpdate(estimation, status);
    sendResponse(res, 200, "Estimation status updated", { estimation });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getClients,
  getClient,
  getAllEstimations,
  updateEstimationStatus,
};
