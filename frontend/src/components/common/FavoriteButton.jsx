//FavoriteButton.jsx
import { useAuth0 } from "@auth0/auth0-react";
import { FiHeart } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";

import {
  addToFavorites,
  removeFromFavorites,
} from "store/slices/favoritesSlice";

const FavoriteButton = ({ itemId, className = "", size = 20 }) => {
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const userInfo = useSelector((state) => state.user.info);
  const favorites = useSelector((state) => state.favorites.items);
  const pendingUpdates = useSelector((state) => state.favorites.pendingUpdates);

  const isFavorite = favorites.includes(Number(itemId));
  const isPending = pendingUpdates.includes(Number(itemId));

  const handleToggle = (e) => {
    e.stopPropagation(); // Prevent triggering parent click events
    e.preventDefault();

    if (!userInfo?.id) return;

    const favoriteData = {
      itemId: Number(itemId),
      userId: userInfo.id,
      getAccessTokenSilently,
    };

    if (isFavorite) {
      dispatch(removeFromFavorites(favoriteData));
    } else {
      dispatch(addToFavorites(favoriteData));
    }
  };

  if (!userInfo?.id) {
    return null; // Don't show favorite button if user is not logged in
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`
        transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-full p-1
        ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isPending ? (
        <div
          className="animate-spin border-2 border-red-500 border-t-transparent rounded-full"
          style={{ width: size, height: size }}
        />
      ) : (
        <FiHeart
          size={size}
          className={
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          }
        />
      )}
    </button>
  );
};

export default FavoriteButton;
