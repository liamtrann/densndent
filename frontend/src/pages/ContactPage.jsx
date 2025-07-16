import React, { useState } from "react";
import { InputField, Paragraph, Button, Breadcrumb } from "common";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* ✅ Reusable breadcrumb */}
      <Breadcrumb path={["Home", "Contact Us | Dens 'N Dente"]} />

      {/* Contact Info + Map */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          {[
            {
              title: "📍 Address",
              content: ["91 Granton Drive,", "Richmond Hill ON, L4B 2N5"],
            },
            { title: "📞 Phone", content: ["1-866-449-9998", "905-475-3367"] },
            { title: "📠 Fax", content: ["905-475-2894"] },
            { title: "📧 Email", content: ["info@densndente.ca"] },
            {
              title: "🕒 Hours",
              content: ["Mon - Fri: 8 am – 6 pm", "Sat - Sun: Closed"],
            },
          ].map((block) => (
            <div key={block.title} className="mb-6">
              <h2 className="text-2xl font-semibold text-orange-600 mb-2">
                {block.title}
              </h2>
              {block.content.map((line, idx) => (
                <Paragraph key={idx} className="text-lg">
                  {line}
                </Paragraph>
              ))}
            </div>
          ))}
        </div>

        <div className="w-full">
          <iframe
            title="Dens N Dente Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.9935608106554!2d-79.40456472357487!3d43.858589671093824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2ecb9c67a08f%3A0x61dc4d8fa77343c4!2sDens%20%E2%80%98N%20Dente%20Healthcare!5e0!3m2!1sen!2sca!4v1687221745913"
            width="100%"
            height="350"
            allowFullScreen=""
            loading="lazy"
            className="rounded-md shadow-md border"
          />
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white shadow-lg p-6 rounded border">
        <h2 className="text-2xl font-semibold mb-4">Contact us</h2>
        <Paragraph className="mb-6">
          Leave us a message, and we will reply shortly.
        </Paragraph>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Enter your name…"
              required
            />
            <InputField
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Enter your last name…"
              required
            />
          </div>

          <InputField
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email address…"
            required
          />

          <InputField
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us how we can help…"
            type="textarea"
            required
            className="h-32"
          />

          <Button
            type="submit"
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded"
          >
            SEND
          </Button>
        </form>
      </div>
    </div>
  );
}
