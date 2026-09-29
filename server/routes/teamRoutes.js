import express from "express";

import upload from "../middleware/teamUpload.js";
import {
  getTeamMembers,
  getActiveTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberStatus,
} from "../controllers/teamController.js";

const router =
  express.Router();


/*
====================================================
PUBLIC TEAM
====================================================
*/

router.get(
  "/active",
  getActiveTeamMembers
);

router.get(
  "/",
  getTeamMembers
);

router.get(
  "/:id",
  getTeamMember
);


/*
====================================================
CREATE
POST /api/team
multipart/form-data
====================================================
*/

router.post("/", upload.single("image"), createTeamMember);


/*
====================================================
UPDATE
PUT /api/team/:id
multipart/form-data
====================================================
*/

router.put(
  "/:id",
  upload.single("image"),
  updateTeamMember
);


/*
====================================================
STATUS
PUT /api/team/:id/status
====================================================
*/

router.put(
  "/:id/status",
  toggleTeamMemberStatus
);


/*
====================================================
DELETE
DELETE /api/team/:id
====================================================
*/

router.delete(
  "/:id",
  deleteTeamMember
);


export default router;