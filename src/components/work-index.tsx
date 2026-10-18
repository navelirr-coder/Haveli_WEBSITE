"use client";
import { useState } from "react";
import { motion, MotionConfig } from "motion/react";
import { projects, type ProjectCategory } from "@/data/projects";
import { ProjectCard } from "./project-card";

const filters = ["All work", "Brand identity", "Packaging"] as const;
export function WorkIndex() {
  const [category, setCategory] = useState<"All work" | ProjectCategory>("All work");
  const visible = projects.filter((project) => category === "All work" || category === project.category);
  return <MotionConfig reducedMotion="user"><section className="section-pad">
    <div className="work-filter" role="group" aria-label="Filter projects by service">{filters.map((filter) => <motion.button type="button" key={filter} className="filter-button" aria-pressed={category === filter} whileTap={{ scale: .96 }} onClick={() => setCategory(filter)}>{filter}</motion.button>)}<span className="filter-count" role="status">{visible.length} project{visible.length === 1 ? "" : "s"}</span></div>
    <div className="project-grid">{visible.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
  </section></MotionConfig>;
}
