//FavoriteButoon.jsx
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

  const userInfo = useSelector((s) => s.user.info);
  const favorites = useSelector((s) => s.favorites.items);
  const pendingUpdates = useSelector((s) => s.favorites.pendingUpdates);

  const numericId = Number(itemId);
  const isFavorite = favorites.includes(numericId);
  const isPending = pendingUpdates.includes(numericId);

  const handleToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!userInfo?.id) return;

    const payload = {
      itemId: numericId,
      userId: userInfo.id,
      getAccessTokenSilently,
    };

    if (isFavorite) dispatch(removeFromFavorites(payload));
    else dispatch(addToFavorites(payload));
  };

  if (!userInfo?.id) return null; // hide if not logged in

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`transition-all duration-200 hover:scale-110 focus:outline-none rounded-full p-1
        ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      style={{ lineHeight: 0 }}
    >
      {isPending ? (
        <div
          className="animate-spin border-2 border-red-500 border-t-transparent rounded-full"
          style={{ width: size, height: size }}
        />
      ) : (
        <FiHeart
          size={size}
          className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}
        />
      )}
    </button>
  );
};

export default FavoriteButton;
