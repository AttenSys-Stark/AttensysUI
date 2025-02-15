export const handleSubmit = (
  event: React.FormEvent<HTMLFormElement>,
  searchValue: any,
  router: any,
) => {
  event.preventDefault();
  if (searchValue.trim()) {
    // Redirect to the dynamic page with the user's input
    router.push(`/Explorer/${searchValue}`);
  }
};

export const handleCourse = (
  event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  courseName: any,
  router: any,
) => {
  event.preventDefault();
  if (courseName.trim()) {
    // Redirect to the dynamic page with the user's input
    router.push(`/coursepage/${courseName}`);
  }
};
export const handleCoursehome = (
  event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  courseName: any,
  router: any,
) => {
  event.preventDefault();
  if (courseName.trim()) {
    // Redirect to the dynamic page with the user's input
    router.push(`/Course/Coursehome/course-home-landing-page`);
  }
};

export const handleMyCourse = (
  event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  section: any,
  router: any,
) => {
  event.preventDefault();
  if (section.trim()) {
    // Redirect to the dynamic page with the user's input
    router.push(`/mycoursepage/${section}`);
  }
};

export const handleMyCourseSubComp = (
  event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  section: any,
  router: any,
  sub: any,
) => {
  event.preventDefault();
  sessionStorage.setItem("scrollPosition", `${window.scrollY}`);
  // Redirect to the dynamic page with the user's input
  router.push(`/mycoursepage/${section}/`);
};

export const handleCreateCourse = (
  event: React.FormEvent<HTMLButtonElement | HTMLDivElement | HTMLFormElement>,
  section: any,
  router: any,
) => {
  event.preventDefault();
  if (section.trim()) {
    // Redirect to the dynamic page with the user's input
    router.push(`/Course/CreateACourse/${section}`);
  }
};
