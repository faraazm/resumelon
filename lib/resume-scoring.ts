// Resume scoring engine — pure client-side, no AI calls

export interface FieldFeedback {
  field: string;
  status: "complete" | "needs-work" | "missing";
  message: string;
}

export interface SectionScore {
  name: string;
  key: string;
  weight: number;
  score: number; // 0-100
  status: "complete" | "needs-work" | "missing";
  feedback: FieldFeedback[];
  suggestions: string[];
}

export interface ResumeScore {
  overall: number; // 0-100 weighted
  sectionsComplete: number;
  totalSections: number;
  sections: SectionScore[];
}

interface ResumeInput {
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
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
  }>;
  skills: string[];
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

function wordCount(text: string): number {
  const stripped = stripHtml(text);
  if (!stripped) return 0;
  return stripped.split(/\s+/).filter(Boolean).length;
}

function scorePersonalDetails(pd: ResumeInput["personalDetails"]): SectionScore {
  const feedback: FieldFeedback[] = [];
  const suggestions: string[] = [];
  let filled = 0;
  const total = 3;

  if (pd.firstName.trim()) {
    filled++;
    feedback.push({ field: "First Name", status: "complete", message: "Provided" });
  } else {
    feedback.push({ field: "First Name", status: "missing", message: "Missing — add your first name" });
    suggestions.push("Add your first name");
  }

  if (pd.lastName.trim()) {
    filled++;
    feedback.push({ field: "Last Name", status: "complete", message: "Provided" });
  } else {
    feedback.push({ field: "Last Name", status: "missing", message: "Missing — add your last name" });
    suggestions.push("Add your last name");
  }

  if (pd.jobTitle.trim()) {
    filled++;
    feedback.push({ field: "Job Title", status: "complete", message: "Provided" });
  } else {
    feedback.push({ field: "Job Title", status: "missing", message: "Missing — add a professional title (e.g. 'Software Engineer')" });
    suggestions.push("Add a professional title like 'Software Engineer' or 'Marketing Manager'");
  }

  const score = Math.round((filled / total) * 100);
  const status = score === 100 ? "complete" : score > 0 ? "needs-work" : "missing";

  return { name: "Personal Details", key: "personal", weight: 10, score, status, feedback, suggestions };
}

function scoreContact(contact: ResumeInput["contact"]): SectionScore {
  const feedback: FieldFeedback[] = [];
  const suggestions: string[] = [];
  let score = 0;

  // Email + phone are essential (100 points total)
  const hasEmail = !!contact.email.trim();
  const hasPhone = !!contact.phone.trim();

  if (hasEmail) {
    score += 50;
    feedback.push({ field: "Email", status: "complete", message: "Provided" });
  } else {
    feedback.push({ field: "Email", status: "missing", message: "Missing — employers need a way to reach you" });
    suggestions.push("Add your email address");
  }

  if (hasPhone) {
    score += 50;
    feedback.push({ field: "Phone", status: "complete", message: "Provided" });
  } else {
    feedback.push({ field: "Phone", status: "missing", message: "Missing — add a phone number for callbacks" });
    suggestions.push("Add your phone number");
  }

  // LinkedIn + location are optional — they don't affect the score
  if (contact.linkedin.trim()) {
    feedback.push({ field: "LinkedIn", status: "complete", message: "Provided" });
  } else {
    feedback.push({ field: "LinkedIn", status: "complete", message: "Optional — LinkedIn profiles strengthen your application" });
  }

  if (contact.location.trim()) {
    feedback.push({ field: "Location", status: "complete", message: "Provided" });
  } else {
    feedback.push({ field: "Location", status: "complete", message: "Optional — helps with location-based roles" });
  }

  const status = score === 100 ? "complete" : score > 0 ? "needs-work" : "missing";

  return { name: "Contact Info", key: "contact", weight: 15, score, status, feedback, suggestions };
}

function scoreSummary(summary: string): SectionScore {
  const feedback: FieldFeedback[] = [];
  const suggestions: string[] = [];
  const words = wordCount(summary);

  let score = 0;

  if (words === 0) {
    feedback.push({ field: "Summary", status: "missing", message: "Empty — write a 2-4 sentence professional summary" });
    suggestions.push("Write a concise professional summary highlighting your key strengths and career goals");
  } else if (words < 30) {
    score = 40;
    feedback.push({ field: "Summary", status: "needs-work", message: `Too short (${words} words) — aim for 50-200 words` });
    suggestions.push("Expand your summary to at least 50 words for better impact");
  } else if (words < 50) {
    score = 65;
    feedback.push({ field: "Summary", status: "needs-work", message: `A bit short (${words} words) — aim for 50-200 words` });
    suggestions.push("Add a few more sentences to reach at least 50 words");
  } else if (words <= 200) {
    score = 100;
    feedback.push({ field: "Summary", status: "complete", message: `Good length (${words} words)` });
  } else {
    score = 70;
    feedback.push({ field: "Summary", status: "needs-work", message: `Too long (${words} words) — keep it under 200 words` });
    suggestions.push("Trim your summary to under 200 words for better readability");
  }

  const status = score === 100 ? "complete" : score > 0 ? "needs-work" : "missing";

  return { name: "Summary", key: "summary", weight: 20, score, status, feedback, suggestions };
}

function scoreExperience(experience: ResumeInput["experience"]): SectionScore {
  const feedback: FieldFeedback[] = [];
  const suggestions: string[] = [];

  if (experience.length === 0) {
    feedback.push({ field: "Experience", status: "missing", message: "No experience entries — add at least one job" });
    suggestions.push("Add at least one work experience entry");
    return { name: "Experience", key: "experience", weight: 30, score: 0, status: "missing", feedback, suggestions };
  }

  let totalPoints = 0;
  const maxPoints = experience.length;

  for (const job of experience) {
    const bulletCount = job.bullets.filter((b) => stripHtml(b).length > 0).length;
    const hasTitle = !!job.title.trim();
    const hasCompany = !!job.company.trim();

    if (!hasTitle || !hasCompany) {
      feedback.push({
        field: `${job.title || "Untitled"} at ${job.company || "Unknown"}`,
        status: "needs-work",
        message: "Missing job title or company name",
      });
      suggestions.push(`Complete the details for your ${job.title || "untitled"} position`);
      totalPoints += 0.3;
      continue;
    }

    if (bulletCount === 0) {
      feedback.push({
        field: `${job.title} at ${job.company}`,
        status: "needs-work",
        message: "No bullet points — add 3-5 achievement bullets",
      });
      suggestions.push(`Add bullet points describing your achievements at ${job.company}`);
      totalPoints += 0.4;
    } else if (bulletCount < 3) {
      feedback.push({
        field: `${job.title} at ${job.company}`,
        status: "needs-work",
        message: `Only ${bulletCount} bullet${bulletCount === 1 ? "" : "s"} — aim for 3-5`,
      });
      suggestions.push(`Add more bullet points for ${job.title} at ${job.company}`);
      totalPoints += 0.6;
    } else if (bulletCount <= 5) {
      // Check bullet quality (word count)
      const weakBullets = job.bullets.filter((b) => wordCount(b) < 10 && stripHtml(b).length > 0).length;
      if (weakBullets > 0) {
        feedback.push({
          field: `${job.title} at ${job.company}`,
          status: "needs-work",
          message: `${weakBullets} bullet${weakBullets === 1 ? "" : "s"} too short — use at least 10 words each`,
        });
        suggestions.push(`Expand short bullets for ${job.title} at ${job.company} to be more descriptive`);
        totalPoints += 0.8;
      } else {
        feedback.push({
          field: `${job.title} at ${job.company}`,
          status: "complete",
          message: `${bulletCount} strong bullet points`,
        });
        totalPoints += 1;
      }
    } else {
      feedback.push({
        field: `${job.title} at ${job.company}`,
        status: "needs-work",
        message: `${bulletCount} bullets — consider trimming to 5 for conciseness`,
      });
      suggestions.push(`Trim bullets for ${job.title} at ${job.company} to your top 5 achievements`);
      totalPoints += 0.85;
    }
  }

  const score = Math.round((totalPoints / maxPoints) * 100);
  const status = score >= 80 ? "complete" : score > 0 ? "needs-work" : "missing";

  return { name: "Experience", key: "experience", weight: 30, score, status, feedback, suggestions };
}

function scoreEducation(education: ResumeInput["education"]): SectionScore {
  const feedback: FieldFeedback[] = [];
  const suggestions: string[] = [];

  if (education.length === 0) {
    feedback.push({ field: "Education", status: "missing", message: "No education entries — add at least one" });
    suggestions.push("Add your highest level of education");
    return { name: "Education", key: "education", weight: 10, score: 0, status: "missing", feedback, suggestions };
  }

  let totalPoints = 0;
  const maxPoints = education.length;

  for (const edu of education) {
    const hasDegree = !!edu.degree.trim();
    const hasSchool = !!edu.school.trim();

    if (hasDegree && hasSchool) {
      feedback.push({ field: `${edu.degree} — ${edu.school}`, status: "complete", message: "Complete" });
      totalPoints += 1;
    } else {
      const missing = !hasDegree && !hasSchool ? "degree and school" : !hasDegree ? "degree" : "school";
      feedback.push({
        field: `${edu.degree || "Untitled"} — ${edu.school || "Unknown"}`,
        status: "needs-work",
        message: `Missing ${missing}`,
      });
      suggestions.push(`Complete the ${missing} for your education entry`);
      totalPoints += 0.5;
    }
  }

  const score = Math.round((totalPoints / maxPoints) * 100);
  const status = score >= 80 ? "complete" : score > 0 ? "needs-work" : "missing";

  return { name: "Education", key: "education", weight: 10, score, status, feedback, suggestions };
}

function scoreSkills(skills: string[]): SectionScore {
  const feedback: FieldFeedback[] = [];
  const suggestions: string[] = [];
  const count = skills.filter((s) => s.trim()).length;

  let score = 0;

  if (count === 0) {
    feedback.push({ field: "Skills", status: "missing", message: "No skills listed — add 5-15 relevant skills" });
    suggestions.push("Add at least 5 skills relevant to your target role");
  } else if (count < 5) {
    score = 50;
    feedback.push({ field: "Skills", status: "needs-work", message: `Only ${count} skill${count === 1 ? "" : "s"} — aim for 5-15` });
    suggestions.push("Add more skills to reach at least 5");
  } else if (count <= 15) {
    score = 100;
    feedback.push({ field: "Skills", status: "complete", message: `${count} skills listed` });
  } else {
    score = 75;
    feedback.push({ field: "Skills", status: "needs-work", message: `${count} skills — consider trimming to 15 most relevant` });
    suggestions.push("Remove less relevant skills to keep the list focused (max 15)");
  }

  const status = score === 100 ? "complete" : score > 0 ? "needs-work" : "missing";

  return { name: "Skills", key: "skills", weight: 15, score, status, feedback, suggestions };
}

export function scoreResume(resume: ResumeInput): ResumeScore {
  const sections = [
    scorePersonalDetails(resume.personalDetails),
    scoreContact(resume.contact),
    scoreSummary(resume.summary),
    scoreExperience(resume.experience),
    scoreEducation(resume.education),
    scoreSkills(resume.skills),
  ];

  const overall = Math.round(
    sections.reduce((sum, s) => sum + (s.score * s.weight) / 100, 0)
  );

  const sectionsComplete = sections.filter((s) => s.status === "complete").length;

  return {
    overall,
    sectionsComplete,
    totalSections: sections.length,
    sections,
  };
}
