"use client";

interface ATSResumePreviewProps {
  data: {
    personalDetails: {
      firstName: string;
      lastName: string;
      jobTitle: string;
    };
    contact: {
      email: string;
      phone: string;
      linkedin: string;
      location: string;
    };
    summary: string;
    experience: Array<{
      id: string;
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      bullets: string[];
    }>;
    education: Array<{
      id: string;
      degree: string;
      school: string;
      startDate: string;
      endDate: string;
    }>;
    skills: string[];
  };
  font?: "calibri" | "arial" | "georgia" | "garamond" | "helvetica" | "verdana";
}

const fontClasses = {
  calibri: "font-calibri",
  arial: "font-arial",
  georgia: "font-georgia",
  garamond: "font-garamond",
  helvetica: "font-helvetica",
  verdana: "font-verdana",
};

export function ATSResumePreview({ data, font = "calibri" }: ATSResumePreviewProps) {
  const { personalDetails, contact, summary, experience, education, skills } = data;
  const fontClass = fontClasses[font];
  const hasName = personalDetails.firstName || personalDetails.lastName;
  const hasContact = contact.email || contact.phone || contact.location || contact.linkedin;
  const hasSummary = summary && summary.trim().length > 0;
  const hasExperience = experience && experience.length > 0;
  const hasEducation = education && education.length > 0;
  const hasSkills = skills && skills.length > 0;

  return (
    <div
      className={`w-full bg-white text-black ${fontClass}`}
      style={{
        padding: "40px 50px",
        fontSize: "11pt",
        lineHeight: "1.4",
        minHeight: "100%",
      }}
    >
      {/* Header - Name and Title */}
      {hasName && (
        <header className="text-center mb-4">
          <h1
            className="font-bold uppercase tracking-wide"
            style={{ fontSize: "18pt", marginBottom: "4px" }}
          >
            {personalDetails.firstName} {personalDetails.lastName}
          </h1>
          {personalDetails.jobTitle && (
            <p style={{ fontSize: "12pt", color: "#333" }}>
              {personalDetails.jobTitle}
            </p>
          )}
        </header>
      )}

      {/* Contact Information */}
      {hasContact && (
        <div
          className="text-center mb-5 pb-3"
          style={{
            borderBottom: "1px solid #000",
            fontSize: "10pt",
          }}
        >
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>{contact.phone}</span>}
            {contact.location && <span>{contact.location}</span>}
            {contact.linkedin && (
              <span>
                {contact.linkedin.replace("https://www.", "").replace("https://", "")}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Professional Summary */}
      {hasSummary && (
        <section className="mb-5">
          <h2
            className="font-bold uppercase mb-2"
            style={{
              fontSize: "12pt",
              borderBottom: "1px solid #000",
              paddingBottom: "2px",
            }}
          >
            Professional Summary
          </h2>
          <p style={{ textAlign: "justify" }}>{summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {hasExperience && (
        <section className="mb-5">
          <h2
            className="font-bold uppercase mb-2"
            style={{
              fontSize: "12pt",
              borderBottom: "1px solid #000",
              paddingBottom: "2px",
            }}
          >
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((job) => (
              <div key={job.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold" style={{ fontSize: "11pt" }}>
                      {job.title}
                    </p>
                    <p style={{ fontSize: "10.5pt" }}>
                      {job.company}
                      {job.location && ` | ${job.location}`}
                    </p>
                  </div>
                  <p
                    className="text-right shrink-0"
                    style={{ fontSize: "10pt" }}
                  >
                    {job.startDate} – {job.current ? "Present" : job.endDate}
                  </p>
                </div>
                {job.bullets && job.bullets.length > 0 && (
                  <ul className="mt-2 ml-4" style={{ listStyleType: "disc" }}>
                    {job.bullets.map((bullet, index) => (
                      <li key={index} className="mb-1" style={{ fontSize: "10.5pt" }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {hasEducation && (
        <section className="mb-5">
          <h2
            className="font-bold uppercase mb-2"
            style={{
              fontSize: "12pt",
              borderBottom: "1px solid #000",
              paddingBottom: "2px",
            }}
          >
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <p className="font-bold" style={{ fontSize: "11pt" }}>
                    {edu.degree}
                  </p>
                  <p style={{ fontSize: "10.5pt" }}>{edu.school}</p>
                </div>
                <p className="text-right shrink-0" style={{ fontSize: "10pt" }}>
                  {edu.startDate && edu.endDate
                    ? `${edu.startDate} – ${edu.endDate}`
                    : edu.endDate || edu.startDate}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {hasSkills && (
        <section>
          <h2
            className="font-bold uppercase mb-2"
            style={{
              fontSize: "12pt",
              borderBottom: "1px solid #000",
              paddingBottom: "2px",
            }}
          >
            Skills
          </h2>
          <p style={{ fontSize: "10.5pt" }}>{skills.join(" • ")}</p>
        </section>
      )}

      {/* Empty state */}
      {!hasName && !hasContact && !hasSummary && !hasExperience && !hasEducation && !hasSkills && (
        <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400">
          <p className="text-center">
            Upload your resume to see the preview
          </p>
        </div>
      )}
    </div>
  );
}
