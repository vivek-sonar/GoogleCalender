import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    lastName: { type: String },
    designation: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    attedanceStatus: {
      type: String,
      enum: ["present", "absent", "leave", "half-day"],
   
    },

    userRole: {
      type: String,
      enum: ["admin", "student", "teacher", "parent"],
      required: true,
    },
    isMainAdmin: { type: Boolean, default: false },

    linkedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userRoleRef",
    },
    userRoleRef: {
      type: String,
      enum: ["admin", "student", "teacher", "parent"],
    },

    mobile: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    countryCode: { type: String },

    registeredVia: { type: String, enum: ["email", "google"], required: true },
    googleId: { type: String },
    isEmailVerified: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    inviteToken: { type: String },
    inviteRole: {
      type: String,
      enum: ["admin", "teacher", "student", "parent"],
    },
    isInviteAccepted: { type: Boolean, default: false },
    inviteExpiry: { type: Date },

    otp: { type: String },
    otpExpiry: { type: Date },
    messageId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message"}],

    teacherId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
    studentId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    branchId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Branch" }],
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent" },
    schoolId: [{ type: mongoose.Schema.Types.ObjectId, ref: "School" }],
    sectionId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
    classId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    // For students: array of { schoolId, classId, sectionId }
    studentSchools: [
      {
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
        sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section" }
      }
    ],
    profileImage: { type: String },
  },
  { timestamps: true }
);

// Virtual Field
userSchema
  .virtual("confirmPassword")
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (value) {
    this._confirmPassword = value;
  });

export default mongoose.models.User || mongoose.model("User", userSchema);