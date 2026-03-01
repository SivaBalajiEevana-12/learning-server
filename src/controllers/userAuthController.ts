import { User, UserAddressSchema } from "../models/Users";
import bcrypt from "bcrypt";

const registerUser = async (req: any, res: any) => {
  try {
    const {
      userName,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      Address,
    } = req.body;

    // 🔹 Check existing user (parallel)
    const [existingEmail, existingUsername] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ userName }),
    ]);

    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "User with this username already exists" });
    }

    // 🔹 Hash password (safe rounds)
    const passwordHash = await bcrypt.hash(password, 10);

    // 🔹 Create user
    const newUser = new User({
      userName,
      firstName,
      lastName,
      email,
      password: passwordHash,
      phoneNumber,
      Address: [],
    });

    await newUser.save();

    // 🔹 Create address only if provided
    if (Address) {
      const userAddress = await UserAddressSchema.create({
        userId: newUser._id,
        street: Address.street,
        city: Address.city,
        state: Address.state,
        zipCode: Address.zipCode,
      });

      newUser.Address = [userAddress._id];
      await newUser.save();
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export { registerUser };