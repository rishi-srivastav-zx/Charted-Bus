import Bus from '../models/busmodel.js';
import cloudnaryConfig from '../config/cloudnary.js';

export async function getAllBuses(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      minCapacity,
      maxCapacity,
      minPrice,
      maxPrice,
      amenities,
      sortBy = 'Bus.createdAt',
      order = 'desc',
      available
    } = req.query;

    const filter = { isAvailable: true };
    
    if (type) filter.type = type;
    if (available !== undefined) filter.isAvailable = available === 'true';
    if (minCapacity || maxCapacity) {
      filter.capacity = {};
      if (minCapacity) filter.capacity.$gte = parseInt(minCapacity);
      if (maxCapacity) filter.capacity.$lte = parseInt(maxCapacity);
    }
    if (minPrice || maxPrice) {
      filter.pricePerHour = {};
      if (minPrice) filter.pricePerHour.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerHour.$lte = parseFloat(maxPrice);
    }
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      filter['amenities.name'] = { $in: amenitiesArray };
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const buses = await Bus.find(filter)
      .populate('operator', 'name logo rating')
      .sort(sortOptions)
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * parseInt(limit));

    const count = await Bus.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: buses.length,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: buses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getBusById(req, res) {
  try {
    const bus = await Bus.find.findById(req.params.id)
      .populate('operator', 'name logo rating contact');

    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    const similarBuses = await Bus.find({
      _id: { $ne: bus._id },
      type: bus.type,
      isAvailable: true
    }).limit(3).select('name images.main pricePerHour capacity rating');

    res.status(200).json({
      success: true,
      data: { bus, similarBuses }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function searchBuses(req, res) {
  try {
    const { q, date, passengers } = req.query;
    
    const searchCriteria = {
      isAvailable: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { type: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    };

    if (passengers) {
      searchCriteria.capacity = { $gte: parseInt(passengers) };
    }

    const buses = await Bus.find(searchCriteria)
      .populate('operator', 'name logo')
      .limit(20);

    res.status(200).json({
      success: true,
      count: buses.length,
      data: buses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getFilters(req, res) {
  try {
    const types = await Bus.distinct('type');
    const amenities = await Bus.distinct('amenities.name');
    const maxPrice = await Bus.find.findOne().sort('-pricePerHour').select('pricePerHour');
    const maxCapacity = await Bus.find.findOne().sort('-capacity').select('capacity');

    res.status(200).json({
      success: true,
      data: {
        types,
        amenities,
        priceRange: { min: 0, max: maxPrice?.pricePerHour || 1000 },
        capacityRange: { min: 1, max: maxCapacity?.capacity || 50 }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getPopularBuses(req, res) {
  try {
    const buses = await Bus.find({ 
      isAvailable: true,
      badges: 'Most Popular'
    })
    .populate('operator', 'name logo')
    .limit(6);

    res.status(200).json({
      success: true,
      count: buses.length,
      data: buses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createBus(req, res) {
  try {
    req.body.operator = req.user.id;
    
    const bus = await Bus.create(req.body);
    
    res.status(201).json({
      success: true,
      data: bus
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function updateBus(req, res) {
  try {
    let bus = await Bus.find.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    if (bus.operator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    bus = await Bus.find.Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: bus
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function deleteBus(req, res) {
    try {
        const bus = await Bus.find.findById(req.params.id);

        if (!bus) {
            return res
                .status(404)
                .json({ success: false, message: "Bus not found" });
        }

        if (
            bus.operator.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .json({ success: false, message: "Not authorized" });
        }

        bus.isAvailable = false;
        await bus.save();

        res.status(200).json({
            success: true,
            message: "Bus removed successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function toggleAvailability(req, res) {
    try {
        const bus = await Bus.find.findById(req.params.id);

        if (!bus) {
            return res
                .status(404)
                .json({ success: false, message: "Bus not found" });
        }

        if (
            bus.operator.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .json({ success: false, message: "Not authorized" });
        }

        bus.isAvailable = !bus.isAvailable;
        await bus.save();

        res.status(200).json({
            success: true,
            data: bus,
            message: `Bus is now ${bus.isAvailable ? "available" : "unavailable"}`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function uploadImages(req, res) {
    try {
        const bus = await Bus.find.findById(req.params.id);

        if (!bus) {
            return res
                .status(404)
                .json({ success: false, message: "Bus not found" });
        }

        if (
            bus.operator.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res
                .status(403)
                .json({ success: false, message: "Not authorized" });
        }

        const uploadPromises = req.files.map((file) =>
            cloudnaryConfig.cloudinary.uploader.upload(file.path, { folder: "buses" }),
        );

        const results = await Promise.all(uploadPromises);
        const imageUrls = results.map((result) => result.secure_url);

        bus.images.gallery.push(...imageUrls);
        await bus.save();

        res.status(200).json({
            success: true,
            data: bus.images,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getBusReviews(req, res) {
    try {
        const reviews = await _Bus.find({ bus: req.params.id })
            .populate("user", "name avatar")
            .sort("-Bus.createdAt");

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getAllBusesAdmin(req, res) {
    try {
        const buses = await Bus.find()
            .populate("operator", "name email")
            .sort("-Bus.createdAt");

        res.status(200).json({
            success: true,
            count: buses.length,
            data: buses,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function verifyBus(req, res) {
    try {
        const bus = await Bus.find.Bus.findByIdAndUpdate(
            req.params.id,
            { isVerified: true, verifiedAt: Date.now() },
            { new: true },
        );

        res.status(200).json({
            success: true,
            data: bus,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function permanentDeleteBus(req, res) {
    try {
        await Bus.find.Bus.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Bus permanently deleted",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}