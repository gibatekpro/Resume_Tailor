import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/shared/AppLayout';
import TopNav from '../components/shared/TopNav';
import AppRoutes from '../utils/Routes';
import indeedIcon from '../assets/brand/indeed.com.png';
import linkedinIcon from '../assets/brand/linkedin.com.png';
import gradcrackerIcon from '../assets/brand/gradcracker.com.png';
import upworkIcon from '../assets/brand/upwork.svg';
import fiverrIcon from '../assets/brand/fiverr.svg';
import { useAuth } from '../context/auth/AuthProvider';
import SettingsService from '../service/SettingsService';
import type { SavedSite, SiteGroupKey } from '../models/SavedSite';
import { AddSiteDialog } from '../components/shared/AddSiteDialog';

type SiteCardItem = {
  id?: string; // only sites the user added themselves have an id, and only those can be removed
  name: string;
  url: string;
  description: string;
  icon?: string;
  accent: string;
};

const CUSTOM_SITE_ACCENT = '#2170e4';

const toCardItem = (site: SavedSite): SiteCardItem => ({
  id: site.id,
  name: site.name,
  url: site.url,
  description: site.description || displayHost(site.url),
  accent: CUSTOM_SITE_ACCENT,
});

const displayHost = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

// Bundled logo for the built-in sites; the site's own favicon for added ones, falling back to its first letter.
function SiteIcon({ site }: { site: SiteCardItem }) {
  const [faviconFailed, setFaviconFailed] = useState(false);
  const src = site.icon ?? (faviconFailed ? undefined : `https://${displayHost(site.url)}/favicon.ico`);

  if (!src) {
    return <span style={{ fontSize: '20px', fontWeight: 700, color: site.accent }}>{site.name.charAt(0).toUpperCase()}</span>;
  }
  return (
    <img
      src={src}
      alt=""
      onError={() => setFaviconFailed(true)}
      style={{ width: '26px', height: '26px', objectFit: 'contain' }}
    />
  );
}

const jobSites: SiteCardItem[] = [
  {
    name: 'Indeed',
    url: 'https://www.indeed.com/',
    description: 'Search roles with salary and location filters.',
    icon: indeedIcon,
    accent: '#2557a7',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/jobs/',
    description: 'Discover professional opportunities and hiring teams.',
    icon: linkedinIcon,
    accent: '#0a66c2',
  },
  {
    name: 'Gradcracker',
    url: 'https://www.gradcracker.com/',
    description: 'Graduate roles and early-career opportunities.',
    icon: gradcrackerIcon,
    accent: '#1d4ed8',
  },
];

const freelanceSites: SiteCardItem[] = [
  {
    name: 'Upwork',
    url: 'https://www.upwork.com/',
    description: 'Find freelance projects and consulting work.',
    icon: upworkIcon,
    accent: '#14a800',
  },
  {
    name: 'Fiverr',
    url: 'https://www.fiverr.com/',
    description: 'Browse quick-turn services and specialist gigs.',
    icon: fiverrIcon,
    accent: '#1dbf73',
  },
];

function SiteGroup({ title, sites, onAdd, onRemove }: {
  title: string;
  sites: SiteCardItem[];
  onAdd?: () => void;
  onRemove?: (id: string) => void;
}) {
  return (
    <section style={{ backgroundColor: '#ffffff', border: '1px solid #c6c6cd', borderRadius: '18px', boxShadow: '0px 1px 3px rgba(15,23,42,0.05)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '18px 20px', borderBottom: '1px solid #eaeaf0', background: 'linear-gradient(180deg, rgba(238,244,252,0.6), rgba(255,255,255,0.9))' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: '#161c22' }}>{title}</h2>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="cursor-pointer transition-all duration-200 hover:border-[#2170e4] hover:bg-[#eef4fc]"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '10px', border: '1px solid #c6d9ff', backgroundColor: '#ffffff', color: '#1f4f9c', fontSize: '13px', fontWeight: 600 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Add site
          </button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', padding: '20px' }}>
        {sites.map((site) => (
          <div key={site.id ?? site.name} style={{ position: 'relative', display: 'flex' }}>
          <a
            href={site.url}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '18px 16px',
              borderRadius: '14px',
              border: '1px solid #dfe4ee',
              background: 'linear-gradient(180deg, #ffffff 0%, #f9fbff 100%)',
              textDecoration: 'none',
              color: '#161c22',
              boxShadow: '0px 8px 18px rgba(15,23,42,0.03)',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 14px 24px rgba(33, 112, 228, 0.08)';
              e.currentTarget.style.borderColor = '#c6d9ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0px 8px 18px rgba(15,23,42,0.03)';
              e.currentTarget.style.borderColor = '#dfe4ee';
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: `${site.accent}12`,
                border: `1px solid ${site.accent}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <SiteIcon site={site} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#161c22', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{site.name}</h3>
                {/* Added sites show a remove button in this spot instead */}
                {!site.id && <span className="material-symbols-outlined" style={{ fontSize: '18px', color: site.accent }}>open_in_new</span>}
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.5, color: '#45464d', overflowWrap: 'anywhere' }}>{site.description}</p>
            </div>
          </a>
          {site.id && onRemove && (
            <button
              type="button"
              onClick={() => onRemove(site.id!)}
              aria-label={`Remove ${site.name}`}
              title={`Remove ${site.name}`}
              className="cursor-pointer text-[#76777d] transition-colors hover:bg-[#fff1f1] hover:text-[#ba1a1a]"
              style={{ position: 'absolute', top: '14px', right: '12px', display: 'flex', padding: '2px', border: 'none', borderRadius: '6px', backgroundColor: 'transparent' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
            </button>
          )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const isAuthenticated = !!auth?.isAuthenticated;
  const [savedSites, setSavedSites] = useState<SavedSite[]>(() => SettingsService.getCachedSavedSites());
  const [addToGroup, setAddToGroup] = useState<SiteGroupKey>();
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      void SettingsService.getSavedSites().then(setSavedSites);
    }
  }, [isAuthenticated]);

  const updateSavedSites = async (sites: SavedSite[]) => {
    setSavedSites(sites);
    setSaveError(false);
    try {
      await SettingsService.saveSavedSites(sites);
    } catch {
      setSaveError(true);
    }
  };

  // Added sites belong to the signed-in user, so they're only shown and editable while signed in.
  const sitesFor = (group: SiteGroupKey) =>
    isAuthenticated ? savedSites.filter((site) => site.group === group).map(toCardItem) : [];
  const addSite = (group: SiteGroupKey) => (isAuthenticated ? () => setAddToGroup(group) : undefined);
  const removeSite = isAuthenticated
    ? (id: string) => void updateSavedSites(savedSites.filter((site) => site.id !== id))
    : undefined;

  return (
    <AppLayout>
      <TopNav searchPlaceholder="Search opportunities..." />

      <main className="w-full flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6 lg:px-8">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gap: '24px' }}>
          <section
            className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between"
            style={{
              gap: '20px',
              padding: '28px 28px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #eef4ff 0%, #e8f1ff 15%, #f6f9ff 100%)',
              border: '1px solid #c6d9ff',
              boxShadow: '0px 12px 28px rgba(33,112,228,0.08)',
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2170e4' }}>
                Career launchpad
              </p>
              <h1 style={{ margin: '12px 0 8px', fontSize: '30px', letterSpacing: '-0.04em', color: '#161c22', fontWeight: 700 }}>
                Explore your next opportunity
              </h1>
              <p style={{ margin: 0, fontSize: '15px', color: '#45464d', maxWidth: '580px', lineHeight: 1.6 }}>
                Stay in motion with your job search and keep your resume ready for the next role, contract, or freelance opportunity.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(AppRoutes.resumeInputPage)}
              className="w-full justify-center md:w-auto"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 18px',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: '#2170e4',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 12px 22px rgba(33,112,228,0.2)',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 16px 28px rgba(33,112,228,0.24)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 12px 22px rgba(33,112,228,0.2)';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              Tailor Resume
            </button>
          </section>

          {saveError && (
            <div role="alert" style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #f3c3c3', backgroundColor: '#fff1f1', color: '#7a1f1f', fontSize: '14px' }}>
              Couldn't save your sites to your account. They're kept on this device for now.
            </div>
          )}

          <SiteGroup title="Job sites" sites={[...jobSites, ...sitesFor('job')]} onAdd={addSite('job')} onRemove={removeSite} />
          <SiteGroup title="Freelance sites" sites={[...freelanceSites, ...sitesFor('freelance')]} onAdd={addSite('freelance')} onRemove={removeSite} />

          {addToGroup && (
            <AddSiteDialog
              open={true}
              initialGroup={addToGroup}
              onClose={() => setAddToGroup(undefined)}
              onAdd={(site) => {
                setAddToGroup(undefined);
                void updateSavedSites([...savedSites, site]);
              }}
            />
          )}
        </div>
      </main>
    </AppLayout>
  );
}
