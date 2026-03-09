import { useEffect, useMemo, useState } from 'react';

import SplashIntro from './components/SplashIntro';
import PlaceOrderBar from './components/PlaceOrderBar';
import GlassBottomNav from './components/GlassBottomNav';
import ConfirmOverlay from './components/ConfirmOverlay';
import LoginSheet from './components/LoginSheet';
import OrderSuccessPopup from './components/OrderSuccessPopup';
import ItemDetailSheet from './components/ItemDetailSheet';
import CustomizationSheet from './components/CustomizationSheet';
import AdminLoginPage from './pages/AdminLoginPage';
import HomePage from './pages/HomePage';
import CategoryPageView from './pages/CategoryPageView';
import SearchPageView from './pages/SearchPageView';
import AdminPage from './pages/AdminPage';
import { normalizeMenuItem } from './utils/menuItem';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const ADMIN_SESSION_KEY = 'food-app-admin-token';

function normalizeAllItems(menuItems) {
  if (!menuItems || Object.keys(menuItems).length === 0) return [];
  return Object.entries(menuItems).flatMap(([categoryId, items]) =>
    items.map(item => normalizeMenuItem(item, categoryId))
  );
}

function readStoredAdminToken() {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(ADMIN_SESSION_KEY) || '';
}

function getPageFromPath(pathname, hasAdminToken) {
  if (pathname.startsWith('/admin')) {
    return hasAdminToken ? 'admin' : 'admin-login';
  }

  return 'splash';
}

function syncPathForPage(nextPage) {
  if (typeof window === 'undefined') return;

  const nextPath = nextPage === 'admin' || nextPage === 'admin-login' ? '/admin' : '/';
  if (window.location.pathname !== nextPath) {
    window.history.pushState({}, '', nextPath);
  }
}

export default function App() {
  const [adminToken, setAdminToken] = useState(() => readStoredAdminToken());
  const [page, setPage] = useState(() => getPageFromPath(window.location.pathname, Boolean(readStoredAdminToken())));
  const [renderedPage, setRenderedPage] = useState(() => getPageFromPath(window.location.pathname, Boolean(readStoredAdminToken())));
  const [pageStage, setPageStage] = useState('enter');
  const [ALL_CATEGORIES, setAllCategories] = useState([]);
  const [MENU_ITEMS, setMenuItems] = useState({});
  const [POPULAR_ITEMS, setPopularItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);

  function loadMenu() {
    setMenuLoading(true);

    fetch(`${API_BASE_URL}/api/menu`)
      .then(res => res.json())
      .then(data => {
        setAllCategories(data.categories);
        setMenuItems(data.menuItems);
        setPopularItems(data.menuItems['favourites'] || []);
        setMenuLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch menu:', err);
        setMenuLoading(false);
      });
  }

  useEffect(() => {
    loadMenu();
  }, []);

  const [isDesktopView, setIsDesktopView] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 768;
  });
  const [activeCategoryId, setActiveCategoryId] = useState('dessert');
  const [searchReturnPage, setSearchReturnPage] = useState('home');

  const [cart, setCart] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [itemSelections, setItemSelections] = useState({});
  const [customizationItem, setCustomizationItem] = useState(null);

  const allItems = useMemo(() => normalizeAllItems(MENU_ITEMS), [MENU_ITEMS]);

  useEffect(() => {
    if (page !== 'splash') return undefined;

    const t = setTimeout(() => setPage('home'), 2200);
    return () => clearTimeout(t);
  }, [page]);

  useEffect(() => {
    syncPathForPage(page);
  }, [page]);

  useEffect(() => {
    function handlePopState() {
      const nextToken = readStoredAdminToken();
      setAdminToken(nextToken);
      setPage(getPageFromPath(window.location.pathname, Boolean(nextToken)));
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    function handleResize() {
      setIsDesktopView(window.innerWidth >= 768);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (page === renderedPage) {
      const frame = requestAnimationFrame(() => setPageStage('enter'));
      return () => cancelAnimationFrame(frame);
    }

    setPageStage('exit');

    const t = setTimeout(() => {
      setRenderedPage(page);
      setPageStage('enter');
    }, 180);

    return () => clearTimeout(t);
  }, [page, renderedPage]);

  const cartActions = {
    add: id => setCart(prev => ({ ...prev, [id]: 1 })),
    inc: id => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 })),
    dec: id =>
      setCart(prev => {
        const next = { ...prev };
        const value = (next[id] || 1) - 1;
        if (value <= 0) delete next[id];
        else next[id] = value;
        return next;
      }),
    set: next => setCart(next),
  };

  const totalQty = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const navTab = renderedPage === 'home'
    ? 'home'
    : renderedPage === 'category' || renderedPage === 'search'
      ? 'fastfood'
      : 'person';

  function handleNavChange(tab) {
    if (tab === 'home') {
      goHome();
      return;
    }

    if (tab === 'fastfood') {
      if (renderedPage !== 'category') {
        goCategory(activeCategoryId || ALL_CATEGORIES[0]?.id || 'dessert');
      }
      return;
    }

    setLoginOpen(true);
  }

  function goHome() {
    setPage('home');
  }

  function goCategory(id) {
    setActiveCategoryId(id);
    setPage('category');
  }

  function goSearch(from = page) {
    setSearchReturnPage(from === 'category' ? 'category' : 'home');
    setPage('search');
  }

  function finishOrder() {
    setCart({});
    setConfirmOpen(false);
    setPendingOrder(false);
    setOrderSuccess(true);
  }

  function handleSlidePlaceOrder() {
    setConfirmOpen(false);
    if (user) {
      finishOrder();
      return;
    }
    setPendingOrder(true);
    setLoginOpen(true);
  }

  function handleLoginSuccess(userData) {
    setUser(userData);
    setLoginOpen(false);
    if (pendingOrder) finishOrder();
  }

  function handleItemOpen(item) {
    setDetailItem(item);
  }

  function handleItemClose() {
    setDetailItem(null);
  }

  function handleInitialAdd(item) {
    if (item?.customizable && item.customization?.options?.length) {
      setCustomizationItem(item);
      return;
    }

    cartActions.add(item.id);
  }

  function handleCustomizationConfirm(selection) {
    if (!customizationItem) return;

    setItemSelections(prev => ({
      ...prev,
      [customizationItem.id]: selection,
    }));
    cartActions.add(customizationItem.id);
    setCustomizationItem(null);
  }

  function handleAdminLoginSuccess(session) {
    window.localStorage.setItem(ADMIN_SESSION_KEY, session.token);
    setAdminToken(session.token);
    setPage('admin');
  }

  function handleAdminLogout() {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminToken('');
    setPage('admin-login');
  }

  const isAdminView = page === 'admin' || page === 'admin-login' || renderedPage === 'admin' || renderedPage === 'admin-login';

  if (isDesktopView && !isAdminView) {
    return <DesktopOnlyNotice />;
  }

  if (menuLoading && !isAdminView) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 32 }}>☕</div>
        <p style={{ color: '#888', fontSize: 14 }}>Loading menu...</p>
      </div>
    );
  }



  if (renderedPage === 'splash') {
    return <SplashIntro onDone={() => setPage('home')} />;
  }

  function renderPage() {
    if (renderedPage === 'admin-login') {
      return <AdminLoginPage onSuccess={handleAdminLoginSuccess} onBack={goHome} />;
    }

    if (renderedPage === 'admin') {
      return <AdminPage adminToken={adminToken} onBack={goHome} onLogout={handleAdminLogout} onMenuRefresh={loadMenu} />;
    }
    if (renderedPage === 'home') {
      return (
        <HomePage
          categories={ALL_CATEGORIES}
          menuItems={MENU_ITEMS}
          popularItems={POPULAR_ITEMS}
          cart={cart}
          cartActions={cartActions}
          onCategoryClick={goCategory}
          onSearchOpen={() => goSearch('home')}
          onItemOpen={handleItemOpen}
          onInitialAdd={handleInitialAdd}
          itemSelections={itemSelections}
        />
      );
    }

    if (renderedPage === 'category') {
      return (
        <CategoryPageView
          categories={ALL_CATEGORIES}
          menuItems={MENU_ITEMS}
          categoryId={activeCategoryId}
          cart={cart}
          cartActions={cartActions}
          onBack={goHome}
          onSearchOpen={() => goSearch('category')}
          onItemOpen={handleItemOpen}
          onInitialAdd={handleInitialAdd}
          itemSelections={itemSelections}
        />
      );
    }

    return (
      <SearchPageView
        categories={ALL_CATEGORIES}
        menuItems={MENU_ITEMS}
        cart={cart}
        cartActions={cartActions}
        onBack={() => setPage(searchReturnPage)}
        onCategoryClick={goCategory}
        onItemOpen={handleItemOpen}
        onInitialAdd={handleInitialAdd}
        itemSelections={itemSelections}
      />
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
      <div className="ios-top-chrome-mask" />
      <div className={`page-shell ${pageStage === 'enter' ? 'page-shell-enter' : 'page-shell-exit'}`}>
        {renderPage()}
      </div>

      <GlassBottomNav
        activeTab={navTab}
        onTabChange={handleNavChange}
        orderBarVisible={totalQty > 0}
      />

      <PlaceOrderBar totalQty={totalQty} onClick={() => setConfirmOpen(true)} />

      <ConfirmOverlay
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        cart={cart}
        foodItems={allItems}
        onCartChange={cartActions.set}
        onSlideComplete={handleSlidePlaceOrder}
        itemSelections={itemSelections}
        onAddItem={handleInitialAdd}
      />

      <LoginSheet open={loginOpen} onSuccess={handleLoginSuccess} onClose={() => setLoginOpen(false)} />

      <OrderSuccessPopup open={orderSuccess} onClose={() => setOrderSuccess(false)} />

      <ItemDetailSheet
        item={detailItem}
        open={Boolean(detailItem)}
        qty={detailItem ? cart[detailItem.id] || 0 : 0}
        onClose={handleItemClose}
        onAdd={() => detailItem && handleInitialAdd(detailItem)}
        onIncrease={() => detailItem && cartActions.inc(detailItem.id)}
        onDecrease={() => detailItem && cartActions.dec(detailItem.id)}
        selectedCustomization={detailItem ? itemSelections[detailItem.id] : null}
      />

      <CustomizationSheet
        item={customizationItem}
        open={Boolean(customizationItem)}
        currentSelection={customizationItem ? itemSelections[customizationItem.id] : null}
        onClose={() => setCustomizationItem(null)}
        onConfirm={handleCustomizationConfirm}
      />
    </div>
  );
}

function DesktopOnlyNotice() {
  const qrPattern = [
    '1111111001001111',
    '1000001011101001',
    '1011101010011011',
    '1011101001110011',
    '1011101010001111',
    '1000001010110001',
    '1111111010101011',
    '0001000111100010',
    '1110111100011110',
    '0010100111010011',
    '1111011000111011',
    '0100010111000101',
    '1111111000111111',
    '1000001001100001',
    '1011101010111011',
    '1111111011101111',
  ];

  return (
    <div className="desktop-error">
      <div className="error-content">
        <div className="desktop-pill">Mobile Ordering Only</div>
        <h1>Open This On Your Phone</h1>
        <p>This ordering app is designed only for mobile use.</p>
        <p>Please scan the QR code available on your table to place your order.</p>

        <div className="desktop-qr-shell" aria-hidden="true">
          <div className="desktop-qr-grid">
            {qrPattern.join('').split('').map((cell, index) => (
              <span key={index} className={cell === '1' ? 'desktop-qr-cell filled' : 'desktop-qr-cell'} />
            ))}
          </div>
        </div>

        <div className="desktop-subcopy">For the best experience, use your phone camera or QR scanner and order from your table.</div>
      </div>
    </div>
  );
}



