import uuid from 'uuid/v4';

import Factory from '../lib/factory';

const factorySymbol = Symbol('factory');

if (!global[factorySymbol]) {
  const factory = new Factory();

  factory.register('topic', 'Topic', ({ preparationMaterialsCount = 1, courseCount = 2 }) => ({
    id: () => uuid(),
    title: () => Faker.random.words(),
    color: () => Faker.internet.color(),
    lightColor: () => Faker.internet.color(),
    icon: () => Faker.image.imageUrl(),
    slug: () => Faker.random.word(),
    preparationMaterials: ({ rel: { many } }) =>
      many('preparationMaterial', preparationMaterialsCount),
    courses: ({ rel: { many } }) => many('course', courseCount),
  }));

  factory.register('preparationMaterial', 'PreparationMaterial', () => ({
    id: () => uuid(),
    position: () => Faker.random.number(),
    title: () => Faker.random.words(),
    subtitle: () => Faker.random.words(),
    description: () => Faker.lorem.paragraph(),
    icon: 'play',
    link: () => Faker.internet.url(),
  }));

  factory.register('teachingMaterial', 'TeachingMaterial', () => ({
    id: () => uuid(),
    position: () => Faker.random.number(),
    title: () => Faker.random.words(),
    subtitle: () => Faker.random.words(),
    description: () => Faker.lorem.sentences(),
    mediumType: 'medium_type_video',
    icon: 'play',
    image: () => Faker.image.imageUrl(),
    link: () => Faker.internet.url(),
    listingTitle: () => Faker.random.words(),
    listingIcon: () => Faker.random.words(),
    lessonContent: true,
    listingItem: true,
  }));

  factory.register('course', 'Course', ({ lessonsCount = 1 }) => {
    const courseId = uuid();
    return {
      id: () => courseId,
      title: () => Faker.random.words(),
      description: () => Faker.lorem.sentences(),
      slug: () => Faker.random.word(),
      lessons: ({ rel: { many } }) => many('lesson', lessonsCount, { course: courseId }),
    };
  });

  factory.register(
    'lesson',
    'Lesson',
    ({ commonMistakesCount = 1, expertisesCount = 1, teachingMaterialsCount = 1 }) => ({
      id: () => uuid(),
      title: () => Faker.random.words(),
      description: () => Faker.lorem.sentences(),
      commonMistakes: ({ rel: { many } }) => many('commonMistake', commonMistakesCount),
      expertises: ({ rel: { many } }) => many('expertise', expertisesCount),
      teachingMaterials: ({ rel: { many } }) => many('teachingMaterial', teachingMaterialsCount),
    }),
  );

  factory.register('expertise', 'Expertise', () => ({
    id: () => uuid(),
    title: () => Faker.random.words(),
  }));

  factory.register('commonMistake', 'CommonMistake', () => ({
    id: () => uuid(),
    problem: () => Faker.random.words(),
    solution: () => Faker.random.words(),
  }));

  factory.register('class', 'Class', ({ coursesCount = 2 }) => ({
    id: () => uuid(),
    girlCount: () => Faker.random.number().toString(),
    boyCount: () => Faker.random.number().toString(),
    completedLessons: () => [],
    courses: ({ rel: { many } }) => many('course', coursesCount),
  }));

  factory.register('schoolClass', 'Class', ({ coursesCount = 2 }) => ({
    resourceType: 'school_class',
    id: () => uuid(),
    girlCount: () => Faker.random.number().toString(),
    boyCount: () => Faker.random.number().toString(),
    className: () => Faker.company.companyName(),
    schoolYear: () => Faker.random.number().toString(),
    grade: () => Faker.random.number().toString(),
    plannedSchoolUsage: () => Faker.lorem.paragraph(),
    schoolSubject: () => Faker.random.words(),
    completedLessons: () => [],
    courses: ({ rel: { many } }) => many('course', coursesCount),
  }));

  factory.register('extracurricular', 'Class', ({ coursesCount = 2 }) => ({
    resourceType: 'extracurricular',
    id: () => uuid(),
    girlCount: () => Faker.random.number().toString(),
    boyCount: () => Faker.random.number().toString(),
    groupName: () => Faker.company.companyName(),
    year: () => Faker.random.number().toString(),
    age: () => Faker.random.number().toString(),
    plannedExtracurricularUsage: () => Faker.lorem.paragraph(),
    completedLessons: () => [],
    courses: ({ rel: { many } }) => many('course', coursesCount),
  }));

  factory.register('user', 'User', () => ({
    id: () => uuid(),
    token: () => Faker.random.alphaNumeric(20),
    email: () => Faker.internet.email(),
    firstName: () => Faker.name.firstName(),
    lastName: () => Faker.name.lastName(),
    privacyPolicyAccepted: true,
    intercomHash: () => Faker.random.alphaNumeric(20),
    createdAt: () => parseInt(new Date(Faker.date.past()).getTime() / 1000, 10),
    schoolClassesCount: () => Faker.random.number(),
    teacher: () => Faker.random.boolean(),
    locality: ({ rel: { one } }) => one('courseInstructorLocality', 1),
  }));

  factory.register('registration', 'User', () => {
    const password = Faker.internet.password();

    return {
      role: 'role_teacher',
      email: () => Faker.internet.email(),
      firstName: () => Faker.name.firstName(),
      lastName: () => Faker.name.lastName(),
      password,
      passwordConfirmation: password,
      privacyPolicyAccepted: true,
      referal: () => Faker.lorem.sentence(),
    };
  });

  factory.register('country', 'Country', ({ stateCount = 1, countryCode = 'DEU' }) => ({
    id: `${countryCode}`,
    value: `${countryCode}`,
    code: countryCode,
    name: () => Faker.address.country(),
    postalCodeFormat: '/.*/',
    states() {
      const states = {};
      for (let i = 0; i < stateCount; i += 1) {
        states[i.toString()] = Faker.address.state();
      }
      return states;
    },
  }));

  factory.register('courseInstructorLocality', 'Locality', () => ({
    id: uuid(),
    schoolType: null,
    schoolTypeCustom: null,
    schoolName: null,
    country: 'country_de',
    countryCustom: null,
    state: 'BB',
    stateCustom: null,
    city: 'Potsdam',
    postalCode: '12345',
    subjects: 'Softwareentwicklung',
  }));

  factory.register('courseSchoolClass', 'CourseSchoolClass', () => ({
    id: () => uuid(),
    certificateCompleted: true,
    certificateUrl: () => Faker.internet.url(),
    course: ({ rel: { one } }) => one('course'),
    schoolClass: ({ rel: { one } }) => one('class'),
  }));

  factory.register('post', 'Post', () => ({
    id: () => uuid(),
    title: Faker.lorem.sentence(),
    content: Faker.lorem.paragraphs(),
    teaserImageUrl: () => Faker.internet.url(),
    releasedAt: Faker.date.past(),
  }));

  global[factorySymbol] = factory;
}

export default global[factorySymbol];
