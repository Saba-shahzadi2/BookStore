import Contact from "../models/Contact.js";

// ==========================================
// Submit Contact Message
// ==========================================

const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    // ==========================================
    // Normalize Input
    // ==========================================

    const cleanName = typeof name === "string" ? name.trim() : "";

    const cleanEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    const cleanSubject = typeof subject === "string" ? subject.trim() : "";

    const cleanMessage = typeof message === "string" ? message.trim() : "";

    // ==========================================
    // Create Contact Message
    // ==========================================

    await Contact.create({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
    });

    // ==========================================
    // Success Response
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact Form Error:", error);

    // ==========================================
    // Mongoose Validation Error
    // ==========================================

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((item) => item.message);

      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    // ==========================================
    // Server Error
    // ==========================================

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// ==========================================
// Export
// ==========================================

export { submitContactMessage };
