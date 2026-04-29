import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/job';
import { Mentor } from '@/models/mentor';
import { User } from '@/models/user';

const jobsData = [
  {
    title: "React Frontend Developer",
    company: "TCS (Tata Consultancy Services)",
    location: "Bangalore, India",
    type: "Full-time",
    salary: "₹25,000 - ₹40,000/month",
    posted: "2 days ago",
    description: "Join our frontend team to build scalable UIs using React and Tailwind CSS for government and private sector projects.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Redux"],
    level: "Entry Level",
    category: "Development",
    employerId: "user_mock_employer_1"
  },
  {
    title: "Data Analyst",
    company: "Infosys",
    location: "Hyderabad, India",
    type: "Hybrid",
    salary: "₹35,000 - ₹55,000/month",
    posted: "1 day ago",
    description: "Analyze business data, build dashboards and help stakeholders take decisions using Power BI and Python.",
    skills: ["Python", "Power BI", "SQL", "Excel"],
    level: "Intermediate",
    category: "Data",
    employerId: "user_mock_employer_2"
  },
  {
    title: "WordPress Developer",
    company: "Freelance (Upwork)",
    location: "Remote (India)",
    type: "Project-based",
    salary: "₹8,000 - ₹15,000/project",
    posted: "3 days ago",
    description: "Looking for a WordPress expert to create and customize responsive themes for Indian small businesses.",
    skills: ["WordPress", "PHP", "JavaScript"],
    level: "Entry Level",
    category: "Development",
    employerId: "user_mock_employer_3"
  },
  {
    title: "Python Backend Intern",
    company: "Wipro",
    location: "Pune, India",
    type: "Internship",
    salary: "₹15,000/month",
    posted: "1 day ago",
    description: "Work with Django APIs and PostgreSQL for a scalable SaaS platform in education.",
    skills: ["Python", "Django", "PostgreSQL"],
    level: "Entry Level",
    category: "Development",
    employerId: "user_mock_employer_4"
  },
  {
    title: "Power BI Dashboard Freelancer",
    company: "Startup Remote",
    location: "Remote",
    type: "Freelance",
    salary: "₹5,000/project",
    posted: "4 days ago",
    description: "Build an interactive dashboard to visualize e-commerce sales data using Power BI.",
    skills: ["Power BI", "Excel", "Data Visualization"],
    level: "Beginner",
    category: "Data",
    employerId: "user_mock_employer_5"
  },
  {
    title: "Junior MERN Stack Developer",
    company: "Zoho Corp",
    location: "Chennai, India",
    type: "Full-time",
    salary: "₹30,000/month",
    posted: "2 days ago",
    description: "Develop and maintain modules for internal tools using the MERN stack.",
    skills: ["MongoDB", "Express.js", "React", "Node.js"],
    level: "Intermediate",
    category: "Development",
    employerId: "user_mock_employer_6"
  },
  {
    title: "R Programming Analyst",
    company: "Indian BioStats",
    location: "Ahmedabad, India",
    type: "Part-time",
    salary: "₹18,000/month",
    posted: "5 days ago",
    description: "Work with health datasets and automate report generation using R and RMarkdown.",
    skills: ["R", "RMarkdown", "Data Cleaning"],
    level: "Intermediate",
    category: "Data",
    employerId: "user_mock_employer_7"
  },
  {
    title: "Machine Learning Intern",
    company: "AI Startup - BrainGrid",
    location: "Remote",
    type: "Internship",
    salary: "₹10,000/month",
    posted: "Today",
    description: "Train ML models for user behavior predictions. Great for students with basic ML exposure.",
    skills: ["Python", "scikit-learn", "Pandas", "Jupyter"],
    level: "Entry Level",
    category: "Data",
    employerId: "user_mock_employer_8"
  },
  {
    title: "Shopify Website Setup",
    company: "Indian Handmade Store",
    location: "Remote",
    type: "Freelance",
    salary: "₹12,000/project",
    posted: "2 days ago",
    description: "Setup and customize a Shopify store with theme editing and plugin setup.",
    skills: ["Shopify", "HTML/CSS", "Liquid", "JavaScript"],
    level: "Beginner",
    category: "Development",
    employerId: "user_mock_employer_9"
  },
  {
    title: "Excel Automation Assistant",
    company: "Local Tax Consultant",
    location: "Indore, India",
    type: "Part-time",
    salary: "₹6,000/month",
    posted: "Yesterday",
    description: "Automate tax report generation using formulas and VBA macros.",
    skills: ["Excel", "VBA", "Macros"],
    level: "Beginner",
    category: "Data",
    employerId: "user_mock_employer_10"
  },
  {
    title: "Frontend Design to Code",
    company: "UI Freelance Client",
    location: "Remote",
    type: "Freelance",
    salary: "₹5,000/project",
    posted: "3 days ago",
    description: "Convert Figma designs into responsive HTML/CSS pages with Tailwind.",
    skills: ["HTML", "CSS", "Tailwind", "Figma"],
    level: "Entry Level",
    category: "Development",
    employerId: "user_mock_employer_11"
  },
  {
    title: "SQL Data Intern",
    company: "RetailChain Pvt. Ltd.",
    location: "Mumbai, India",
    type: "Internship",
    salary: "₹7,000/month",
    posted: "4 days ago",
    description: "Query customer purchase data and generate business insights using SQL.",
    skills: ["SQL", "MySQL", "Data Querying"],
    level: "Beginner",
    category: "Data",
    employerId: "user_mock_employer_12"
  }
];

const mentorsData = [
  {
    name: "Sarah Chen",
    expertise: "Full Stack Development",
    rating: 4.9,
    hourlyRate: 45,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&h=250&auto=format&fit=crop",
    specialties: ["React", "Node.js", "TypeScript"],
    availability: "Available next week",
    country: "Singapore",
    clerkId: "user_mock_mentor_1"
  },
  {
    name: "Michael Rodriguez",
    expertise: "Mobile Development",
    rating: 4.8,
    hourlyRate: 40,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250&h=250&auto=format&fit=crop",
    specialties: ["React Native", "iOS", "Android"],
    availability: "Available today",
    country: "USA",
    clerkId: "user_mock_mentor_2"
  },
  {
    name: "Emily Thompson",
    expertise: "UI/UX Design",
    rating: 5.0,
    hourlyRate: 50,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250&h=250&auto=format&fit=crop",
    specialties: ["Figma", "User Research", "Design Systems"],
    availability: "Available tomorrow",
    country: "Canada",
    clerkId: "user_mock_mentor_3"
  },
  {
    name: "Rajeev Mehta",
    expertise: "AI/ML Engineer",
    rating: 4.7,
    hourlyRate: 35,
    image: "https://randomuser.me/api/portraits/men/42.jpg",
    specialties: ["Python", "TensorFlow", "NLP"],
    availability: "Available this week",
    country: "India",
    clerkId: "user_mock_mentor_4"
  },
  {
    name: "Priya Sharma",
    expertise: "Cloud DevOps",
    rating: 4.8,
    hourlyRate: 38,
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    specialties: ["AWS", "Docker", "Kubernetes"],
    availability: "Available in 2 days",
    country: "India",
    clerkId: "user_mock_mentor_5"
  },
  {
    name: "Aarav Patel",
    expertise: "Cybersecurity Analyst",
    rating: 4.6,
    hourlyRate: 30,
    image: "https://randomuser.me/api/portraits/men/33.jpg",
    specialties: ["Ethical Hacking", "SIEM", "Firewalls"],
    availability: "Available today",
    country: "India",
    clerkId: "user_mock_mentor_6"
  },
  {
    name: "Neha Bansal",
    expertise: "Data Analyst",
    rating: 4.9,
    hourlyRate: 32,
    image: "https://randomuser.me/api/portraits/women/30.jpg",
    specialties: ["Excel", "Power BI", "SQL"],
    availability: "Available this weekend",
    country: "India",
    clerkId: "user_mock_mentor_7"
  },
  {
    name: "Karan Verma",
    expertise: "Blockchain Developer",
    rating: 4.7,
    hourlyRate: 42,
    image: "https://randomuser.me/api/portraits/men/85.jpg",
    specialties: ["Solidity", "Ethereum", "Smart Contracts"],
    availability: "Available in 3 days",
    country: "India",
    clerkId: "user_mock_mentor_8"
  },
  {
    name: "Sneha Kapoor",
    expertise: "Product Manager",
    rating: 5.0,
    hourlyRate: 55,
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    specialties: ["Agile", "Scrum", "Product Strategy"],
    availability: "Available next week",
    country: "India",
    clerkId: "user_mock_mentor_9"
  },
  {
    name: "Rohan Desai",
    expertise: "Game Developer",
    rating: 4.5,
    hourlyRate: 36,
    image: "https://randomuser.me/api/portraits/men/28.jpg",
    specialties: ["Unity", "C#", "Unreal Engine"],
    availability: "Available tomorrow",
    country: "India",
    clerkId: "user_mock_mentor_10"
  }
];

const employersData = [
  { clerkId: "user_mock_employer_1", username: "TCS Hiring Team", role: "Employer" },
  { clerkId: "user_mock_employer_2", username: "Infosys HR", role: "Employer" },
  { clerkId: "user_mock_employer_3", username: "Freelance Client #3", role: "Employer" },
  { clerkId: "user_mock_employer_4", username: "Wipro Recruitment", role: "Employer" },
  { clerkId: "user_mock_employer_5", username: "Startup Founder", role: "Employer" },
  { clerkId: "user_mock_employer_6", username: "Zoho Careers", role: "Employer" },
  { clerkId: "user_mock_employer_7", username: "Indian BioStats", role: "Employer" },
  { clerkId: "user_mock_employer_8", username: "BrainGrid AI", role: "Employer" },
  { clerkId: "user_mock_employer_9", username: "Shopify Store Owner", role: "Employer" },
  { clerkId: "user_mock_employer_10", username: "Local Consultant", role: "Employer" },
  { clerkId: "user_mock_employer_11", username: "Design Client", role: "Employer" },
  { clerkId: "user_mock_employer_12", username: "RetailChain HR", role: "Employer" },
];

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing data
    await Job.deleteMany({});
    await Mentor.deleteMany({});
    await User.deleteMany({ clerkId: { $regex: /^user_mock_employer_/ } });
    
    // Insert new data
    await Job.insertMany(jobsData);
    await Mentor.insertMany(mentorsData);
    await User.insertMany(employersData);
    
    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
