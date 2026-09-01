const courses = [
  { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, certificate: 'Web and Computer Programming', description: 'This course will introduce students to programming.', completed: true },
  { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, certificate: 'Web and Computer Programming', description: 'This course introduces students to the World Wide Web.', completed: true },
  { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, certificate: 'Web and Computer Programming', description: 'CSE 111 students become more organized, efficient.', completed: true },
  { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, certificate: 'Web and Computer Programming', description: 'This course will introduce the notion of classes and objects.', completed: false },
  { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, certificate: 'Web and Computer Programming', description: 'This course builds on prior experience in Web Fundamentals.', completed: true },
  { subject: 'WDD', number: 231, title: 'Frontend Web Development I', credits: 2, certificate: 'Web and Computer Programming', description: 'This course focuses on user experience, accessibility.', completed: false }
];

const coursesContainer = document.getElementById('courses');
const totalCreditsP = document.getElementById('total-credits');

function displayCourses(filtered) {
  coursesContainer.innerHTML = '';
  filtered.forEach(course => {
    const div = document.createElement('div');
    div.classList.add('course-card');
    if (course.completed) div.classList.add('completed');
    div.textContent = `${course.subject} ${course.number}`;
    div.setAttribute('title', `${course.title} - ${course.credits} credits`);
    coursesContainer.appendChild(div);
  });
  const totalCredits = filtered.reduce((sum, c) => sum + c.credits, 0);
  totalCreditsP.textContent = `The total credits for course listed above is ${totalCredits}`;
}

displayCourses(courses);

document.getElementById('all').addEventListener('click', (e) => {
  setActive(e.target);
  displayCourses(courses);
});
document.getElementById('cse').addEventListener('click', (e) => {
  setActive(e.target);
  displayCourses(courses.filter(c => c.subject === 'CSE'));
});
document.getElementById('wdd').addEventListener('click', (e) => {
  setActive(e.target);
  displayCourses(courses.filter(c => c.subject === 'WDD'));
});

function setActive(button) {
  document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
  button.classList.add('active');
}
