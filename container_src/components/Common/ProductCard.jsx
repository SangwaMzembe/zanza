import {
  formatDate,
  formatPriceAbbreviated,
  formatSalaryRange,
  t,
} from "@/utils";
import { BiBadgeCheck } from "react-icons/bi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { manageFavouriteApi } from "@/utils/api";
import { useSelector } from "react-redux";
import { userSignUpData } from "@/redux/reducer/authSlice";
import CustomLink from "@/components/Common/CustomLink";
import { toast } from "sonner";
import { setIsLoginOpen } from "@/redux/reducer/globalStateSlice";
import CustomImage from "./CustomImage";

const ProductCard = ({ item, handleLike }) => {
  const userData = useSelector(userSignUpData);
  const isJobCategory = Number(item?.category?.is_job_category) === 1;
  const translated_item = item.translated_item;

  const isHidePrice = isJobCategory
    ? [item?.min_salary, item?.max_salary].every(
        (val) =>
          val === null ||
          val === undefined ||
          (typeof val === "string" && val.trim() === "")
      )
    : item?.price === null ||
      item?.price === undefined ||
      (typeof item?.price === "string" && item?.price.trim() === "");

  const productLink =
    userData?.id === item?.user_id
      ? `/my-listing/${item?.slug}`
      : `/ad-details/${item.slug}`;

  // Extract automotive-specific custom fields with more robust matching
  const automotiveFieldNames = ['year', 'mileage', 'transmission', 'fuel type', 'fuel_type', 'engine', 'engine size'];
  const automotiveFields = item?.item_custom_field_values?.filter(field => {
    const fieldName = field.custom_field?.name?.toLowerCase()?.trim();
    return fieldName && automotiveFieldNames.some(key => fieldName === key || fieldName.includes(key));
  });

  const handleLikeItem = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!userData) {
        setIsLoginOpen(true);
        return;
      }
      const response = await manageFavouriteApi.manageFavouriteApi({
        item_id: item?.id,
      });
      if (response?.data?.error === false) {
        toast.success(response?.data?.message);
        handleLike(item?.id);
      } else {
        toast.error(t("failedToLike"));
      }
    } catch (error) {
      console.log(error);
      toast.error(t("failedToLike"));
    }
  };

  return (
    <CustomLink
      href={productLink}
      className="group relative overflow-hidden rounded-2xl border border-border hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 bg-white flex flex-col h-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <CustomImage
          src={item?.image}
          width={400}
          height={250}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt="Product"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white font-semibold">View Details →</span>
        </div>
        {item?.is_feature && (
          <div className="flex items-center gap-1 ltr:rounded-tl rtl:rounded-tr py-1 px-2 bg-primary absolute top-0 ltr:left-0 rtl:right-0">
            <BiBadgeCheck size={16} color="white" />
            <p className="text-white text-xs sm:text-sm font-medium">{t("featured")}</p>
          </div>
        )}

        <div
          onClick={handleLikeItem}
          className="absolute h-10 w-10 ltr:right-2 rtl:left-2 top-2 bg-white p-2 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-200"
        >
          {item?.is_liked ? (
            <button>
              <FaHeart size={20} className="like_icon" />
            </button>
          ) : (
            <button>
              <FaRegHeart size={20} className="like_icon" />
            </button>
          )}
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-sm sm:text-base font-semibold line-clamp-1">
          {translated_item?.name || item?.name}
        </p>

        {!isHidePrice && (
          <p
            className="text-lg sm:text-xl font-bold text-primary break-all text-balance"
            title={
              isJobCategory
                ? formatSalaryRange(item?.min_salary, item?.max_salary)
                : formatPriceAbbreviated(item?.price)
            }
          >
            {isJobCategory
              ? formatSalaryRange(item?.min_salary, item?.max_salary)
              : formatPriceAbbreviated(item?.price)}
          </p>
        )}

        {automotiveFields && automotiveFields.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-text-secondary">
            {automotiveFields.slice(0, 3).map((field, index) => (
              <span key={field.id} className="flex items-center gap-1">
                {field.value}
                {index < Math.min(automotiveFields.length - 1, 2) && <span>•</span>}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 text-xs sm:text-sm text-text-secondary">
          <p className="line-clamp-1 flex items-center gap-1">
            <HiLocationMarker className="flex-shrink-0" size={14} aria-hidden="true" />
            <span>{item?.translated_address}</span>
          </p>
          <p className="whitespace-nowrap">
            {formatDate(item?.created_at)}&lrm;
          </p>
        </div>
      </div>
    </CustomLink>
  );
};

export default ProductCard;
