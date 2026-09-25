import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import "./Team.css";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiBookOpen,
  FiGlobe,
  FiLinkedin,
  FiAward,
} from "react-icons/fi";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
)
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");
  
function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`${API_URL}/api/team/public`);

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        const members = data?.team || data?.members || [];

        setTeam(Array.isArray(members) ? members : []);
      } catch (error) {
        console.error("Failed to load team members:", error);
        setTeam([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <>
      <Navbar />

      <main className="team-page">
        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="team-hero">
          <div className="team-container">
            <motion.div
              className="team-heading"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="team-eyebrow">OUR TEAM</p>

              <h1>Meet the AVS Solar Experts</h1>

              <p className="team-heading-text">
                Meet the experienced professionals behind AVS Solar
                Consultancy. Our team combines technical expertise,
                industry knowledge, and a commitment to delivering
                reliable solar energy solutions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* =====================================================
            TEAM SECTION
        ====================================================== */}

        <section className="team-section">
          <div className="team-container">
            {loading ? (
              <div className="team-loading">
                <div className="team-loader"></div>
                <p>Loading team members...</p>
              </div>
            ) : team.length === 0 ? (
              <div className="team-empty">
                <FiBriefcase />

                <h3>Our team is being updated</h3>

                <p>
                  Please check back soon to meet our solar
                  professionals.
                </p>
              </div>
            ) : (
              <div className="team-list">
                {team.map((member, index) => (
                  <motion.article
                    className="team-profile"
                    key={
                      member._id ||
                      member.id ||
                      member.email ||
                      index
                    }
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.08,
                    }}
                  >
                    {/* =================================================
                        LEFT - FULL IMAGE
                    ================================================== */}

                    <div className="team-profile-image">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name || "AVS Solar Team Member"}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";

                            const fallback =
                              e.currentTarget.parentElement.querySelector(
                                ".team-image-fallback"
                              );

                            if (fallback) {
                              fallback.style.display = "flex";
                            }
                          }}
                        />
                      ) : null}

                      <div
                        className="team-image-fallback"
                        style={{
                          display: member.image
                            ? "none"
                            : "flex",
                        }}
                      >
                        {member.name
                          ?.charAt(0)
                          ?.toUpperCase() || "A"}
                      </div>
                    </div>

                    {/* =================================================
                        RIGHT - MEMBER DETAILS
                    ================================================== */}

                    <div className="team-profile-content">
                      <div className="team-profile-header">
                        <div>
                          <p className="team-profile-label">
                            AVS SOLAR CONSULTANCY
                          </p>

                          <h2>{member.name}</h2>

                          {member.designation && (
                            <p className="team-designation">
                              {member.designation}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* -----------------------------------------------
                          BASIC DETAILS
                      ------------------------------------------------ */}

                      <div className="team-details-grid">
                        {member.experience && (
                          <div className="team-detail">
                            <div className="team-detail-icon">
                              <FiBriefcase />
                            </div>

                            <div>
                              <span>Experience</span>
                              <strong>
                                {member.experience}
                              </strong>
                            </div>
                          </div>
                        )}

                        {member.qualification && (
                          <div className="team-detail">
                            <div className="team-detail-icon">
                              <FiBookOpen />
                            </div>

                            <div>
                              <span>Qualification</span>
                              <strong>
                                {member.qualification}
                              </strong>
                            </div>
                          </div>
                        )}

                        {member.location && (
                          <div className="team-detail">
                            <div className="team-detail-icon">
                              <FiMapPin />
                            </div>

                            <div>
                              <span>Location</span>
                              <strong>
                                {member.location}
                              </strong>
                            </div>
                          </div>
                        )}

                        {member.email && (
                          <div className="team-detail">
                            <div className="team-detail-icon">
                              <FiMail />
                            </div>

                            <div>
                              <span>Email</span>

                              <a
                                href={`mailto:${member.email}`}
                              >
                                {member.email}
                              </a>
                            </div>
                          </div>
                        )}

                        {member.phone && (
                          <div className="team-detail">
                            <div className="team-detail-icon">
                              <FiPhone />
                            </div>

                            <div>
                              <span>Phone</span>

                              <a
                                href={`tel:${member.phone}`}
                              >
                                {member.phone}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* -----------------------------------------------
                          ABOUT
                      ------------------------------------------------ */}

                      {member.bio && (
                        <div className="team-about">
                          <h3>About</h3>

                          <p>{member.bio}</p>
                        </div>
                      )}

                      {/* -----------------------------------------------
                          SKILLS
                      ------------------------------------------------ */}

                      {Array.isArray(member.skills) &&
                        member.skills.length > 0 && (
                          <div className="team-skills-section">
                            <h3>Expertise</h3>

                            <div className="team-skills">
                              {member.skills.map(
                                (skill, skillIndex) => (
                                  <span
                                    key={`${member._id || index}-${skill}-${skillIndex}`}
                                  >
                                    <FiAward />
                                    {skill}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* -----------------------------------------------
                          LINKS
                      ------------------------------------------------ */}

                      {(member.linkedin ||
                        member.website) && (
                        <div className="team-socials">
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="team-social linkedin"
                            >
                              <FiLinkedin />
                              LinkedIn
                            </a>
                          )}

                          {member.website && (
                            <a
                              href={member.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="team-social website"
                            >
                              <FiGlobe />
                              Website
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Team;