// src/App.js
import { useAuth0 } from "@auth0/auth0-react";
import React, { Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { setFavorites, initializeFavorites } from "store/slices/favoritesSlice";
import { fetchUserInfo, clearUserInfo } from "store/slices/userSlice";

import { ProtectedRoute, ToastProvider, Loading } from "./common";
import { Header, Footer, LayoutWithCart, CenteredContent } from "./components";
import ProfileSetupGuard from "./components/guards/ProfileSetupGuard";
import useProfileSetup from "./hooks/useProfileSetup";
import { LandingPage } from "./pages";
import { ListProductNoFilter } from "./components/product";

// Lazy loaded components
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ListProductPage = lazy(
  () => import("./components/product/ListProductPage")
);
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ProfileEditCard = lazy(
  () => import("./components/profile/ProfileEditCard")
);
const PurchaseHistory = lazy(() => import("./pages/PurchaseHistory"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const MeetOurTeam = lazy(() => import("./pages/MeetOurTeam"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const JdiqRaffleWinners = lazy(() => import("./pages/JdiqRaffleWinners"));
const GiftCardProgramPage = lazy(() => import("./pages/GiftCardProgramPage"));
const OurPartners = lazy(() => import("./pages/OurPartners"));
const Q3CataloguePage = lazy(() => import("./pages/Q3CataloguePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
// at the top with other lazy imports
const HistoryOrderDetails = lazy(() => import("./pages/HistoryOrderDetails"));

// Simple placeholder components
const BlogPage = lazy(() => import("./pages/BlogPage"));

const PromotionsPage = lazy(() =>
  Promise.resolve({ default: () => <div>Promotions Page</div> })
);
const CataloguesPage = lazy(() =>
  Promise.resolve({ default: () => <div>Catalogues Page</div> })
);
const ClearancePage = lazy(() => import("./pages/ClearancePage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));

// Loading fallback component
const PageLoading = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <Loading text="Loading page..." />
  </div>
);

export default function App() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.info);
  const favoriteIds = useSelector((s) => s.favorites.items); // ← live Redux favorites

  // Handle profile setup flow
  useProfileSetup();

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserInfo({ user, getAccessTokenSilently }));
    } else {
      dispatch(clearUserInfo());
    }
  }, [isAuthenticated, user, getAccessTokenSilently, dispatch]);

  // Initialize favorites when user info is available
  React.useEffect(() => {
    if (userInfo?.custentity_favorite_item !== undefined) {
      const favorites = initializeFavorites(userInfo.custentity_favorite_item);
      dispatch(setFavorites(favorites));
    }
  }, [userInfo?.custentity_favorite_item, dispatch]);

  // ---------- FAVORITES CSV (put this inside App, after selectors) ----------
  // Normalize whatever the backend returned on the user object
  const userInfoFavCsv =
    typeof userInfo?.custentity_favorite_item === "string"
      ? userInfo.custentity_favorite_item
      : Array.isArray(userInfo?.custentity_favorite_item?.items)
        ? userInfo.custentity_favorite_item.items.map((x) => x.id).join(",")
        : "";

  // Prefer the *live Redux* list (reflects hearts you just clicked); fallback to userInfo
  const favoritesCsv =
    favoriteIds && favoriteIds.length ? favoriteIds.join(",") : userInfoFavCsv;
  // -------------------------------------------------------------------------

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route
                path="/"
                element={
                  <LayoutWithCart>
                    <CenteredContent>
                      <LandingPage />
                    </CenteredContent>
                  </LayoutWithCart>
                }
              />

              {/* Routes WITH Cart Panel */}
              <Route
                path="/product/:id"
                element={
                  <LayoutWithCart>
                    <CenteredContent>
                      <ProductDetail />
                    </CenteredContent>
                  </LayoutWithCart>
                }
              />
              <Route
                path="/products/by-class/:nameAndId"
                element={
                  <LayoutWithCart>
                    <CenteredContent>
                      <ListProductPage by="class" />
                    </CenteredContent>
                  </LayoutWithCart>
                }
              />
              <Route
                path="/products/by-brand/:brandName"
                element={
                  <LayoutWithCart>
                    <CenteredContent>
                      <ListProductPage by="brand" />
                    </CenteredContent>
                  </LayoutWithCart>
                }
              />
              <Route
                path="/products/by-name/:name"
                element={
                  <LayoutWithCart>
                    <CenteredContent>
                      <ListProductPage by="name" />
                    </CenteredContent>
                  </LayoutWithCart>
                }
              />
              <Route
                path="/products/by-category/:categoryNameAndId"
                element={
                  <LayoutWithCart>
                    <CenteredContent>
                      <ListProductPage by="category" />
                    </CenteredContent>
                  </LayoutWithCart>
                }
              />
              <Route
                path="/products"
                element={
                  <LayoutWithCart>
                    <CenteredContent>
                      <ListProductPage by="all" />
                    </CenteredContent>
                  </LayoutWithCart>
                }
              />

              {/* Routes WITHOUT Cart Panel */}
              <Route path="/cart" element={<CartPage />} />
              <Route
                path="/faq"
                element={
                  <CenteredContent>
                    <FAQPage />
                  </CenteredContent>
                }
              />
              <Route
                path="/about"
                element={
                  <CenteredContent>
                    <AboutUs />
                  </CenteredContent>
                }
              />
              <Route
                path="/team"
                element={
                  <CenteredContent>
                    <MeetOurTeam />
                  </CenteredContent>
                }
              />
              <Route
                path="/contact"
                element={
                  <CenteredContent>
                    <ContactPage />
                  </CenteredContent>
                }
              />
              <Route
                path="/blog"
                element={
                  <CenteredContent>
                    <BlogPage />
                  </CenteredContent>
                }
              />

              {/* ---------- Promotions & Catalogues (with breadcrumb fallbacks) ---------- */}



              <Route
                path="/promotions"
                element={
                  <LayoutWithCart>
                    <CenteredContent>
                      <ListProductPage by="promotion" />
                    </CenteredContent>
                  </LayoutWithCart>
                }
              />

              <Route
                path="/promotions/monthly-special"
                element={
                  <LayoutWithCart>
                    <CenteredContent>
                      <ListProductPage by="category" />
                    </CenteredContent>
                  </LayoutWithCart>
                }
              />

              <Route
                path="/promotions/jdiq"
                element={
                  <CenteredContent>
                    <JdiqRaffleWinners />
                  </CenteredContent>
                }
              />

              <Route
                path="/promotions/gift-card"
                element={
                  <CenteredContent>
                    <GiftCardProgramPage />
                  </CenteredContent>
                }
              />

              <Route
                path="/catalogues"
                element={
                  <CenteredContent>
                    <CataloguesPage />
                  </CenteredContent>
                }
              />
              <Route path="/clearance" element={<ClearancePage />} />
              <Route
                path="/blog/:slug"
                element={
                  <CenteredContent>
                    <BlogDetailPage />
                  </CenteredContent>
                }
              />
              <Route
                path="/partners"
                element={
                  <CenteredContent>
                    <OurPartners />
                  </CenteredContent>
                }
              />
              <Route
                path="/promotions/q3-catalogue"
                element={
                  <CenteredContent>
                    <Q3CataloguePage />
                  </CenteredContent>
                }
              />

              {/* ---------- Protected routes ---------- */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/favorites"
                  element={
                    <LayoutWithCart>
                      <CenteredContent>
                        <ListProductNoFilter
                          searchIds={favoritesCsv}
                          by="favoriteItems"
                        />
                      </CenteredContent>
                    </LayoutWithCart>
                  }
                />

                <Route
                  path="/checkout/*"
                  element={
                    <ProfileSetupGuard>
                      <CenteredContent>
                        <CheckoutPage />
                      </CenteredContent>
                    </ProfileSetupGuard>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <LayoutWithCart>
                      <CenteredContent>
                        <ProfilePage />
                      </CenteredContent>
                    </LayoutWithCart>
                  }
                />
                <Route
                  path="/profile/edit"
                  element={
                    <CenteredContent>
                      <ProfileEditCard />
                    </CenteredContent>
                  }
                />
                <Route
                  path="/purchase-history"
                  element={
                    <ProfileSetupGuard>
                      <LayoutWithCart>
                        <CenteredContent>
                          <PurchaseHistory />
                        </CenteredContent>
                      </LayoutWithCart>
                    </ProfileSetupGuard>
                  }
                />
                <Route
                  path="/profile/history/order/:transactionId"
                  element={
                    <ProfileSetupGuard>
                      <LayoutWithCart>
                        <CenteredContent>
                          <HistoryOrderDetails />
                        </CenteredContent>
                      </LayoutWithCart>
                    </ProfileSetupGuard>
                  }
                />
              </Route>

              <Route
                path="*"
                element={
                  <CenteredContent>
                    <NotFound />
                  </CenteredContent>
                }
              />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
