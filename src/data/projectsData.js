export const PROJECT_CATEGORIES = ['All', 'Frontend', 'Backend', 'Full Stack', 'DSA', 'Java'];

export const projects = [
  {
    id: 'crypto-tracker',
    title: 'Crypto Tracker',
    description:
      'A responsive dashboard that tracks real-time cryptocurrency prices, market trends, and portfolio performance.',
    techStack: ['React', 'Tailwind CSS', 'WebSockets', 'Chart.js'],
    github: 'https://github.com/your-username/crypto-tracker',
    demo: '#',
    category: 'Frontend',
    features: [
      'Live price updates using WebSockets.',
      'Interactive charts showing price history and volatility.',
      'Demo portfolio with gains/losses view.',
    ],
    challenges: [
      'Handling noisy real-time data streams in a clean UI.',
      'Keeping charts performant while updating frequently.',
    ],
  },
  {
    id: 'inventory-management',
    title: 'Inventory Management System',
    description:
      'Full-featured inventory control system for tracking stock levels, suppliers, and sales.',
    techStack: ['Node.js', 'Express', 'MongoDB'],
    github: 'https://github.com/your-username/inventory-management-system',
    demo: '#',
    category: 'Backend',
    features: [
      'Barcode-based item lookup and registration.',
      'Low-stock alerts and basic reporting dashboards.',
      'Role-based access for admins and staff.',
    ],
    challenges: [
      'Designing a schema that works for different product types.',
      'Ensuring data consistency when many updates happen at once.',
    ],
  },
  {
    id: 'helpdesk-queue',
    title: 'Helpdesk Ticket Queue System',
    description:
      'Ticketing platform that manages support requests with priority queues and agent assignment.',
    techStack: ['React', 'Node.js', 'Socket.io'],
    github: 'https://github.com/your-username/helpdesk-queue-system',
    demo: '#',
    category: 'Full Stack',
    features: [
      'Real-time ticket updates for agents using WebSockets.',
      'Priority queue so urgent tickets are surfaced first.',
      'Agent dashboard with SLA countdowns.',
    ],
    challenges: [
      'Mapping data structure concepts (queues, priorities) to a real UI.',
      'Preventing conflicting updates when multiple agents act at once.',
    ],
  },
  {
    id: 'task-management',
    title: 'Task Management System',
    description:
      'Kanban-style task manager with drag-and-drop boards and team collaboration.',
    techStack: ['React', 'Express', 'MongoDB', 'DnD Kit'],
    github: 'https://github.com/your-username/task-management-system',
    demo: '#',
    category: 'Full Stack',
    features: [
      'Drag-and-drop tasks between columns using DnD Kit.',
      'Due dates, labels, and basic team assignments.',
      'Persistent board layouts per user.',
    ],
    challenges: [
      'Managing complex drag state while keeping components simple.',
      'Designing APIs that support multiple boards and users.',
    ],
  },
  {
    id: 'bug-tracker',
    title: 'Bug Tracking System',
    description:
      'Issue tracker to log, assign, and resolve bugs with simple workflows for small teams.',
    techStack: ['MongoDB', 'Express', 'React', 'Node.js'],
    github: 'https://github.com/your-username/bug-tracking-system',
    demo: '#',
    category: 'Backend',
    features: [
      'Bug lifecycle from Open → In Progress → Resolved.',
      'Basic project separation and assignees.',
      'Filters by status, severity, and assignee.',
    ],
    challenges: [
      'Modeling bug workflow states in the database.',
      'Making list views fast even with many filters.',
    ],
  },
  {
    id: 'news-app',
    title: 'News App',
    description:
      'Personalized news reader that fetches articles from APIs with category filters and search.',
    techStack: ['React', 'Tailwind CSS', 'News API', 'LocalStorage'],
    github: 'https://github.com/your-username/news-app',
    demo: '#',
    category: 'Frontend',
    features: [
      'Category filters and keyword search.',
      'Save-article functionality stored in LocalStorage.',
      'Simple offline-friendly reading mode.',
    ],
    challenges: [
      'Normalizing different API responses into one data shape.',
      'Avoiding excessive API calls while typing search queries.',
    ],
  },
  {
    id: 'job-portal',
    title: 'Job Portal System (Java Full Stack)',
    description:
      'A Java full stack job portal for job seekers, employers, and admins with moderation tools.',
    techStack: ['Java', 'Spring Boot', 'MySQL', 'XAMPP'],
    github: 'https://github.com/your-username/job-portal-system',
    demo: '#',
    category: 'Java',
    features: [
      'Job seekers search & filter by skills, location, and experience.',
      'Employers post jobs and review applicants in a simple dashboard.',
      'Admins approve jobs and keep the platform healthy.',
    ],
    challenges: [
      'Designing relational tables for jobs, users, and applications.',
      'Keeping queries efficient as more jobs and users are added.',
    ],
  },
];

