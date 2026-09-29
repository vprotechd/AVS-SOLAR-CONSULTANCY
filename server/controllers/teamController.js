import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";  // ← ADD THIS
import TeamMember from "../models/TeamMember.js";

const __filename = fileURLToPath(import.meta.url);  // ← ADD THIS
const __dirname = path.dirname(__filename);

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "http://localhost:5000";



  
/*
====================================================
HELPERS
====================================================
*/

const getImageUrl = (filename) => {
  if (!filename) {
    return "";
  }

  if (
    filename.startsWith("http://") ||
    filename.startsWith("https://")
  ) {
    return filename;
  }

  if (filename.startsWith("/")) {
    return `${BACKEND_URL}${filename}`;
  }

  return `${BACKEND_URL}/uploads/team/${filename}`;
};

const deleteOldImage = (image) => {
  try {
    if (!image) return;

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return;
    }

    let relativePath = image;

    if (relativePath.startsWith("/uploads/")) {
      relativePath = relativePath.substring(1);
    }

    // ✅ CHANGED from process.cwd() to __dirname + ".." (project root)
    const filePath = path.join(__dirname, "..", relativePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Failed to delete old team image:", error.message);
  }
};


const parseSkills = (skills) => {
  if (!skills) {
    return [];
  }

  if (Array.isArray(skills)) {
    return skills
      .map((skill) =>
        String(skill).trim()
      )
      .filter(Boolean);
  }

  try {
    const parsed =
      JSON.parse(skills);

    if (Array.isArray(parsed)) {
      return parsed
        .map((skill) =>
          String(skill).trim()
        )
        .filter(Boolean);
    }
  } catch {
    // Not JSON
  }

  return String(skills)
    .split(",")
    .map((skill) =>
      skill.trim()
    )
    .filter(Boolean);
};


/*
====================================================
GET ALL TEAM MEMBERS
GET /api/team
====================================================
*/

export const getTeamMembers =
  async (req, res) => {
    try {
      const members =
        await TeamMember.find({})
          .sort({
            displayOrder: 1,
            createdAt: -1,
          })
          .lean();

      const formattedMembers =
        members.map((member) => ({
          ...member,

          id: member._id,

          _id: member._id,

          image: getImageUrl(
            member.image
          ),
        }));

      return res.status(200).json({
        success: true,

        count:
          formattedMembers.length,

        team:
          formattedMembers,

        members:
          formattedMembers,
      });
    } catch (error) {
      console.error(
        "Get team members error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch team members",
      });
    }
  };


/*
====================================================
GET ACTIVE TEAM MEMBERS
GET /api/team/active
====================================================
*/

export const getActiveTeamMembers =
  async (req, res) => {
    try {
      const members =
        await TeamMember.find({
          isActive: true,
        })
          .sort({
            displayOrder: 1,
            createdAt: -1,
          })
          .lean();

      const formattedMembers =
        members.map((member) => ({
          ...member,

          id: member._id,

          _id: member._id,

          image: getImageUrl(
            member.image
          ),
        }));

      return res.status(200).json({
        success: true,

        count:
          formattedMembers.length,

        team:
          formattedMembers,

        members:
          formattedMembers,
      });
    } catch (error) {
      console.error(
        "Get active team error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch active team members",
      });
    }
  };


/*
====================================================
GET SINGLE TEAM MEMBER
GET /api/team/:id
====================================================
*/

export const getTeamMember =
  async (req, res) => {
    try {
      const member =
        await TeamMember.findById(
          req.params.id
        ).lean();

      if (!member) {
        return res.status(404).json({
          success: false,
          message:
            "Team member not found",
        });
      }

      return res.status(200).json({
        success: true,

        member: {
          ...member,

          id: member._id,

          _id: member._id,

          image: getImageUrl(
            member.image
          ),
        },
      });
    } catch (error) {
      console.error(
        "Get team member error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch team member",
      });
    }
  };


/*
====================================================
CREATE TEAM MEMBER
POST /api/team
====================================================
*/

export const createTeamMember =
  async (req, res) => {
    try {
      const {
        name,
        designation,
        email,
        phone,
        experience,
        qualification,
        location,
        bio,
        linkedin,
        website,
        isActive,
        displayOrder,
      } = req.body;

      if (
        !name ||
        !String(name).trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name is required",
        });
      }

      if (
        !designation ||
        !String(designation).trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Designation is required",
        });
      }

      const image =
        req.file
          ? `/uploads/team/${req.file.filename}`
          : "";

      const member =
        await TeamMember.create({
          name:
            String(name).trim(),

          designation:
            String(
              designation
            ).trim(),

          email:
            String(
              email || ""
            ).trim().toLowerCase(),

          phone:
            String(
              phone || ""
            ).trim(),

          experience:
            String(
              experience || ""
            ).trim(),

          qualification:
            String(
              qualification || ""
            ).trim(),

          location:
            String(
              location || ""
            ).trim(),

          bio:
            String(
              bio || ""
            ).trim(),

          skills:
            parseSkills(
              req.body.skills
            ),

          image,

          linkedin:
            String(
              linkedin || ""
            ).trim(),

          website:
            String(
              website || ""
            ).trim(),

          isActive:
            isActive === undefined
              ? true
              : String(
                  isActive
                ) !== "false",

          displayOrder:
            Number(
              displayOrder || 0
            ),
        });

      return res.status(201).json({
        success: true,

        message:
          "Team member added successfully",

        member: {
          ...member.toObject(),

          id: member._id,

          _id: member._id,

          image: getImageUrl(
            member.image
          ),
        },
      });
    } catch (error) {
      console.error(
        "Create team member error:",
        error
      );

      if (req.file) {
        try {
          const uploadedPath =
            req.file.path;

          if (
            fs.existsSync(
              uploadedPath
            )
          ) {
            fs.unlinkSync(
              uploadedPath
            );
          }
        } catch {
          // Ignore cleanup errors
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to create team member",
      });
    }
  };


/*
====================================================
UPDATE TEAM MEMBER
PUT /api/team/:id
====================================================
*/

export const updateTeamMember =
  async (req, res) => {
    try {
      const member =
        await TeamMember.findById(
          req.params.id
        );

      if (!member) {
        return res.status(404).json({
          success: false,
          message:
            "Team member not found",
        });
      }

      const oldImage =
        member.image;

      if (
        req.body.name !== undefined
      ) {
        member.name =
          String(
            req.body.name
          ).trim();
      }

      if (
        req.body.designation !==
        undefined
      ) {
        member.designation =
          String(
            req.body.designation
          ).trim();
      }

      if (
        req.body.email !==
        undefined
      ) {
        member.email =
          String(
            req.body.email || ""
          ).trim().toLowerCase();
      }

      if (
        req.body.phone !==
        undefined
      ) {
        member.phone =
          String(
            req.body.phone || ""
          ).trim();
      }

      if (
        req.body.experience !==
        undefined
      ) {
        member.experience =
          String(
            req.body.experience || ""
          ).trim();
      }

      if (
        req.body.qualification !==
        undefined
      ) {
        member.qualification =
          String(
            req.body.qualification || ""
          ).trim();
      }

      if (
        req.body.location !==
        undefined
      ) {
        member.location =
          String(
            req.body.location || ""
          ).trim();
      }

      if (
        req.body.bio !==
        undefined
      ) {
        member.bio =
          String(
            req.body.bio || ""
          ).trim();
      }

      if (
        req.body.skills !==
        undefined
      ) {
        member.skills =
          parseSkills(
            req.body.skills
          );
      }

      if (
        req.body.linkedin !==
        undefined
      ) {
        member.linkedin =
          String(
            req.body.linkedin || ""
          ).trim();
      }

      if (
        req.body.website !==
        undefined
      ) {
        member.website =
          String(
            req.body.website || ""
          ).trim();
      }

      if (
        req.body.displayOrder !==
        undefined
      ) {
        const order =
          Number(
            req.body.displayOrder
          );

        if (
          Number.isFinite(order)
        ) {
          member.displayOrder =
            order;
        }
      }

      if (
        req.body.isActive !==
        undefined
      ) {
        member.isActive =
          req.body.isActive === true ||
          String(
            req.body.isActive
          ) === "true";
      }

      /*
      ----------------------------------------------
      NEW IMAGE
      ----------------------------------------------
      */

      if (req.file) {
        member.image =
          `/uploads/team/${req.file.filename}`;
      }

      await member.save();

      /*
      ----------------------------------------------
      DELETE OLD IMAGE
      ----------------------------------------------
      */

      if (
        req.file &&
        oldImage &&
        oldImage !== member.image
      ) {
        deleteOldImage(
          oldImage
        );
      }

      return res.status(200).json({
        success: true,

        message:
          "Team member updated successfully",

        member: {
          ...member.toObject(),

          id: member._id,

          _id: member._id,

          image: getImageUrl(
            member.image
          ),
        },
      });
    } catch (error) {
      console.error(
        "Update team member error:",
        error
      );

      if (req.file) {
        try {
          if (
            fs.existsSync(
              req.file.path
            )
          ) {
            fs.unlinkSync(
              req.file.path
            );
          }
        } catch {
          // Ignore cleanup errors
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to update team member",
      });
    }
  };


/*
====================================================
DELETE TEAM MEMBER
DELETE /api/team/:id
====================================================
*/

export const deleteTeamMember =
  async (req, res) => {
    try {
      const member =
        await TeamMember.findById(
          req.params.id
        );

      if (!member) {
        return res.status(404).json({
          success: false,
          message:
            "Team member not found",
        });
      }

      deleteOldImage(
        member.image
      );

      await member.deleteOne();

      return res.status(200).json({
        success: true,

        message:
          "Team member deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete team member error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete team member",
      });
    }
  };


/*
====================================================
TOGGLE STATUS
PUT /api/team/:id/status
====================================================
*/

export const toggleTeamMemberStatus =
  async (req, res) => {
    try {
      const member =
        await TeamMember.findById(
          req.params.id
        );

      if (!member) {
        return res.status(404).json({
          success: false,
          message:
            "Team member not found",
        });
      }

      member.isActive =
        !member.isActive;

      await member.save();

      return res.status(200).json({
        success: true,

        message:
          member.isActive
            ? "Team member activated successfully"
            : "Team member deactivated successfully",

        member: {
          ...member.toObject(),

          id: member._id,

          _id: member._id,

          image: getImageUrl(
            member.image
          ),
        },
      });
    } catch (error) {
      console.error(
        "Toggle team member status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update team member status",
      });
    }
  };