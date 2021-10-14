import { ORM } from "redux-orm";

import Class from "./models/class";
import CommonMistake from "./models/common-mistake";
import Country from "./models/country";
import Course from "./models/course";
import CourseSchoolClass from "./models/course-school-class";
import Expertise from "./models/expertise";
import Lesson from "./models/lesson";
import Locality from "./models/locality";
import Post from "./models/post";
import PreparationMaterial from "./models/preparation-material";
import TeachingMaterial from "./models/teaching-material";
import Topic from "./models/topic";
import User from "./models/user";

const models = [
  Class,
  CommonMistake,
  Country,
  Course,
  CourseSchoolClass,
  Expertise,
  Lesson,
  Locality,
  Post,
  PreparationMaterial,
  TeachingMaterial,
  Topic,
  User,
];

const orm = new ORM();

orm.register(...models);

export default orm;

export const modelNames = models.map((model) => model.modelName);
