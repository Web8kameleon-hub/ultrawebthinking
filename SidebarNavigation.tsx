import React from 'react';

interface SidebarLink {
  label: string;
  href: string;
  icon?: React.ReactNode; // Allows passing React components for icons
}

interface SidebarNavigationProps {
  links: SidebarLink[];
}

export default function SidebarNavigation({ links }: SidebarNavigationProps) {
  return (
    <nav style={styles.sidebar} aria-label="Sidebar Navigation">
      <h2 style={styles.title}>Ultraweb</h2>
      <ul style={styles.list}>
        {links.map((link, index) => (
          <li key={index} style={styles.listItem}>
            <a href={link.href} style={styles.link} aria-label={link.label}>
              {link.icon && <span style={styles.icon}>{link.icon}</span>}
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const styles = {
  sidebar: {
    padding: '1rem',
    color: '#fff',
    backgroundColor: '#1a1a2e',
    height: '100vh',
    width: '250px',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    flexGrow: 1,
  },
  listItem: {
    marginBottom: '1rem',
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.3s, color 0.3s',
  },
  linkHover: {
    backgroundColor: '#2d2d8d',
    color: '#fff',
  },
  icon: {
    fontSize: '1.2rem',
  },
};