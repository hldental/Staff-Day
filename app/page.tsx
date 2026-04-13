import React, { FormEvent, useState } from "react";

type FormState = {
  name: string;
  email: string;
  attending: string;
  drink_order: string;
  drink_temperature: string;
  dietary_restrictions: string;
  willing_to_drive: string;
  passenger_count: string;
  treatment_preference: string;
};

const FORM_ENDPOINT = "https://formspree.io/f/xvzdoadk";

const initialState: FormState = {
  name: "",
  email: "",
  attending: "",
  drink_order: "",
  drink_temperature: "",
  dietary_restrictions: "",
  willing_to_drive: "",
  passenger_count: "0",
  treatment_preference: "",
};

export default function StaffDayPage() {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (name: keyof FormState, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "willing_to_drive") {
        if (value !== "Yes") {
          next.passenger_count = "0";
        } else if (!prev.passenger_count || prev.passenger_count === "0") {
          next.passenger_count = "1";
        }
      }

      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setIsSuccess(false);
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
      payload.append("_subject", "New Staff Day RSVP");
      payload.append("event_date", "May 7");
      payload.append("event_time", "8:00 AM - 3:00 PM");
      payload.append("event_location", "Starts at the office");

      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: payload,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setFormData(initialState);
        setStatus("Thanks — your RSVP has been submitted.");
        setIsSuccess(true);
      } else {
        const data = await response.json().catch(() => ({}));
        const message =
          Array.isArray(data?.errors) && data.errors.length > 0
            ? data.errors.map((error: { message?: string }) => error.message).filter(Boolean).join(", ")
            : "Something went wrong. Please try again.";
        setStatus(message);
      }
    } catch (error) {
      setStatus("Unable to submit right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDriving = formData.willing_to_drive === "Yes";

  return (
    <div style={styles.page}>
      <div style={styles.bgGlowTop} />
      <div style={styles.bgGlowBottom} />

      <main style={styles.wrapper}>
        <section style={styles.heroCard}>
          <span style={styles.eyebrow}>Upcoming staff event</span>
          <h1 style={styles.h1}>Staff Day RSVP</h1>
          <p style={styles.heroCopy}>
            We’re looking forward to spending the day together. Please send in your RSVP and
            preferences for Staff Day on <strong>May 7</strong>.
          </p>

          <div style={styles.heroGrid}>
            <div style={styles.heroStat}>
              <span style={styles.heroStatLabel}>Date</span>
              <span style={styles.heroStatValue}>May 7</span>
            </div>
            <div style={styles.heroStat}>
              <span style={styles.heroStatLabel}>Time</span>
              <span style={styles.heroStatValue}>8:00 AM – 3:00 PM</span>
            </div>
            <div style={styles.heroStat}>
              <span style={styles.heroStatLabel}>Starting point</span>
              <span style={styles.heroStatValue}>Office</span>
            </div>
            <div style={styles.heroStat}>
              <span style={styles.heroStatLabel}>Main stop</span>
              <span style={styles.heroStatValue}>Westphalia Inn</span>
            </div>
          </div>
        </section>

        <section style={styles.layout}>
          <div style={styles.card}>
            <h2 style={styles.h2}>What we need from you</h2>
            <div style={styles.infoList}>
              {[
                ["RSVP", "Let us know whether you’ll be attending."],
                [
                  "Westphalia Inn drink order",
                  "Share your drink request and whether you’d like it hot or cold.",
                ],
                [
                  "Dietary restrictions or allergies",
                  "Tell us about anything we should plan around.",
                ],
                [
                  "Driving availability",
                  "Let us know whether you’re willing to drive and how many passengers you can take.",
                ],
                [
                  "Treatment preference",
                  "Choose either a 30-minute massage or a pedicure.",
                ],
              ].map(([title, text]) => (
                <div key={title} style={styles.infoItem}>
                  <strong style={styles.infoTitle}>{title}</strong>
                  <span style={styles.infoText}>{text}</span>
                </div>
              ))}
            </div>

            <div style={styles.note}>
              Please complete the form as soon as you can so transportation and reservations can be
              finalized.
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.h2}>Submit your RSVP</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.fieldRow}>
                <div style={styles.fieldGroup}>
                  <label htmlFor="name" style={styles.label}>
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label htmlFor="email" style={styles.label}>
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label htmlFor="attending" style={styles.label}>
                  Will you attend Staff Day?
                </label>
                <select
                  id="attending"
                  name="attending"
                  required
                  value={formData.attending}
                  onChange={(e) => updateField("attending", e.target.value)}
                  style={styles.input}
                >
                  <option value="">Select one</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Maybe">Maybe</option>
                </select>
              </div>

              <div style={styles.fieldRow}>
                <div style={styles.fieldGroup}>
                  <label htmlFor="drink_order" style={styles.label}>
                    Westphalia Inn drink order
                  </label>
                  <input
                    id="drink_order"
                    name="drink_order"
                    placeholder="Latte, tea, coffee, etc."
                    value={formData.drink_order}
                    onChange={(e) => updateField("drink_order", e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label htmlFor="drink_temperature" style={styles.label}>
                    Hot or cold?
                  </label>
                  <select
                    id="drink_temperature"
                    name="drink_temperature"
                    value={formData.drink_temperature}
                    onChange={(e) => updateField("drink_temperature", e.target.value)}
                    style={styles.input}
                  >
                    <option value="">Select one</option>
                    <option value="Hot">Hot</option>
                    <option value="Cold">Cold</option>
                  </select>
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label htmlFor="dietary_restrictions" style={styles.label}>
                  Dietary restrictions or allergies
                </label>
                <textarea
                  id="dietary_restrictions"
                  name="dietary_restrictions"
                  placeholder="List any dietary restrictions, allergies, or accommodations."
                  value={formData.dietary_restrictions}
                  onChange={(e) => updateField("dietary_restrictions", e.target.value)}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.fieldRow}>
                <div style={styles.fieldGroup}>
                  <label htmlFor="willing_to_drive" style={styles.label}>
                    Willing to drive?
                  </label>
                  <select
                    id="willing_to_drive"
                    name="willing_to_drive"
                    required
                    value={formData.willing_to_drive}
                    onChange={(e) => updateField("willing_to_drive", e.target.value)}
                    style={styles.input}
                  >
                    <option value="">Select one</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div style={styles.fieldGroup}>
                  <label htmlFor="passenger_count" style={styles.label}>
                    If yes, how many passengers?
                  </label>
                  <input
                    id="passenger_count"
                    name="passenger_count"
                    type="number"
                    min={0}
                    step={1}
                    disabled={!isDriving}
                    value={formData.passenger_count}
                    onChange={(e) => updateField("passenger_count", e.target.value)}
                    style={{
                      ...styles.input,
                      ...(isDriving ? null : styles.disabledInput),
                    }}
                  />
                  <div style={styles.helper}>Leave as 0 if you are not driving.</div>
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Treatment preference</label>
                <div style={styles.radioGrid}>
                  {[
                    ["30-minute massage", "A relaxing 30-minute session."],
                    ["Pedicure", "A classic pedicure treatment."],
                  ].map(([option, detail]) => {
                    const checked = formData.treatment_preference === option;
                    return (
                      <label
                        key={option}
                        style={{
                          ...styles.radioCard,
                          ...(checked ? styles.radioCardSelected : null),
                        }}
                      >
                        <input
                          type="radio"
                          name="treatment_preference"
                          value={option}
                          checked={checked}
                          onChange={(e) => updateField("treatment_preference", e.target.value)}
                          required
                          style={styles.radioInput}
                        />
                        <span style={styles.radioTitle}>{option}</span>
                        <small style={styles.radioDetail}>{detail}</small>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={styles.submitWrap}>
                <button type="submit" disabled={isSubmitting} style={styles.button}>
                  {isSubmitting ? "Sending..." : "Send RSVP"}
                </button>

                {status ? (
                  <div style={isSuccess ? { ...styles.status, ...styles.statusSuccess } : styles.status}>
                    {status}
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </section>

        <footer style={styles.footer}>Staff Day • May 7 • 8:00 AM – 3:00 PM</footer>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 35%), radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.06), transparent 30%), #f6f7fb",
    color: "#1f2937",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  bgGlowTop: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: "50%",
    top: -120,
    left: -80,
    background: "rgba(37, 99, 235, 0.08)",
    filter: "blur(20px)",
    pointerEvents: "none",
  },
  bgGlowBottom: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: "50%",
    bottom: -80,
    right: -60,
    background: "rgba(59, 130, 246, 0.08)",
    filter: "blur(20px)",
    pointerEvents: "none",
  },
  wrapper: {
    width: "min(1100px, calc(100% - 32px))",
    margin: "0 auto",
    padding: "72px 0 40px",
    position: "relative",
    zIndex: 1,
  },
  heroCard: {
    background: "linear-gradient(135deg, rgba(37, 99, 235, 0.96), rgba(29, 78, 216, 0.92))",
    color: "#ffffff",
    borderRadius: 28,
    padding: 40,
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
    marginBottom: 28,
  },
  eyebrow: {
    display: "inline-block",
    fontSize: 14,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    opacity: 0.85,
    marginBottom: 14,
  },
  h1: {
    margin: "0 0 14px",
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    lineHeight: 1.05,
  },
  heroCopy: {
    maxWidth: 700,
    fontSize: 17,
    opacity: 0.95,
    marginBottom: 28,
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14,
  },
  heroStat: {
    background: "rgba(255, 255, 255, 0.12)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    borderRadius: 16,
    padding: 16,
    backdropFilter: "blur(6px)",
  },
  heroStatLabel: {
    display: "block",
    fontSize: 13,
    opacity: 0.85,
    marginBottom: 6,
  },
  heroStatValue: {
    fontSize: 16,
    fontWeight: 700,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 1.15fr",
    gap: 24,
    alignItems: "start",
  },
  card: {
    background: "#ffffff",
    border: "1px solid rgba(229, 231, 235, 0.9)",
    borderRadius: 20,
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
    padding: 28,
  },
  h2: {
    margin: "0 0 18px",
    fontSize: 22,
  },
  infoList: {
    display: "grid",
    gap: 16,
  },
  infoItem: {
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    background: "#fbfcfe",
  },
  infoTitle: {
    display: "block",
    marginBottom: 6,
    fontSize: 16,
  },
  infoText: {
    color: "#6b7280",
  },
  note: {
    marginTop: 18,
    padding: 16,
    borderRadius: 16,
    background: "#eff6ff",
    color: "#1e3a8a",
    border: "1px solid #bfdbfe",
  },
  form: {
    display: "grid",
    gap: 18,
  },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  fieldGroup: {
    display: "grid",
    gap: 8,
  },
  label: {
    fontWeight: 600,
    fontSize: 15,
  },
  input: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: 14,
    padding: "14px 14px",
    font: "inherit",
    color: "#1f2937",
    background: "#ffffff",
  },
  textarea: {
    width: "100%",
    minHeight: 110,
    resize: "vertical",
    border: "1px solid #d1d5db",
    borderRadius: 14,
    padding: "14px 14px",
    font: "inherit",
    color: "#1f2937",
    background: "#ffffff",
  },
  disabledInput: {
    background: "#f3f4f6",
    color: "#6b7280",
  },
  helper: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: -2,
  },
  radioGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
  radioCard: {
    display: "block",
    padding: 16,
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    background: "#fbfcfe",
    cursor: "pointer",
  },
  radioCardSelected: {
    border: "1px solid #2563eb",
    background: "rgba(37, 99, 235, 0.08)",
    boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.08)",
  },
  radioInput: {
    marginBottom: 12,
  },
  radioTitle: {
    display: "block",
    fontWeight: 600,
    marginBottom: 6,
  },
  radioDetail: {
    color: "#6b7280",
  },
  submitWrap: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
  },
  button: {
    appearance: "none",
    border: 0,
    background: "#2563eb",
    color: "#ffffff",
    padding: "14px 22px",
    borderRadius: 999,
    font: "inherit",
    fontWeight: 700,
    cursor: "pointer",
  },
  status: {
    fontSize: 15,
    color: "#6b7280",
  },
  statusSuccess: {
    color: "#065f46",
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    padding: "10px 14px",
    borderRadius: 12,
  },
  footer: {
    textAlign: "center",
    color: "#6b7280",
    padding: "24px 0 0",
    fontSize: 15,
  },
};
