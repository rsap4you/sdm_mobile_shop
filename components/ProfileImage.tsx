"use client";

import {
  useRef,
  useState,
} from "react";

interface Props {
  profileImage?: string;

  onUploaded?: (
    url: string
  ) => void;
}

export default function ProfileImageUpload({
  profileImage = "",
  onUploaded,
}: Props) {
  const fileRef =
    useRef<HTMLInputElement>(
      null
    );

  const [image, setImage] =
    useState(profileImage);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ====================================================
  // UPLOAD
  // ====================================================

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    // --------------------------------------------------
    // FILE TYPE
    // --------------------------------------------------

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowed.includes(
        file.type
      )
    ) {
      setError(
        "Only JPG, PNG and WEBP images are allowed."
      );

      return;
    }

    // --------------------------------------------------
    // FILE SIZE
    // --------------------------------------------------

    if (
      file.size >
      3 * 1024 * 1024
    ) {
      setError(
        "Image must be smaller than 3 MB."
      );

      return;
    }

    // --------------------------------------------------
    // JWT
    // --------------------------------------------------

    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      setError(
        "Please log in again."
      );

      return;
    }

    // --------------------------------------------------
    // FORM DATA
    // --------------------------------------------------

    const formData =
      new FormData();

    formData.append(
      "image",
      file
    );

    setUploading(true);

    try {
      const response =
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile-image`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Upload failed."
        );
      }

      // Update local image
      setImage(
        data.profileImage
      );

      // Update Auth Context
      if (onUploaded) {
        onUploaded(
          data.profileImage
        );
      }
    } catch (error: any) {
      setError(
        error.message ||
          "Unable to upload image."
      );
    } finally {
      setUploading(false);

      if (
        fileRef.current
      ) {
        fileRef.current.value =
          "";
      }
    }
  }

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      {/* ============================================= */}
      {/* PROFILE IMAGE */}
      {/* ============================================= */}

      <div
        style={{
          width: "150px",
          height: "150px",
          margin: "0 auto 20px",
          borderRadius: "50%",
          overflow: "hidden",
          background:
            "#f2f2f2",
          border:
            "3px solid #ddd",
        }}
      >
        {image ? (
          <img
            src={image}
            alt="Profile"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              fontSize:
                "60px",
            }}
          >
            👤
          </div>
        )}
      </div>

      {/* ============================================= */}
      {/* SELECT IMAGE */}
      {/* ============================================= */}

      <label
        htmlFor="profile-image"
        className="btn"
        style={{
          display:
            "inline-block",
          cursor: uploading
            ? "not-allowed"
            : "pointer",
        }}
      >
        {uploading
          ? "Uploading..."
          : image
          ? "Change Photo"
          : "Upload Photo"}
      </label>

      <input
        ref={fileRef}
        id="profile-image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={
          handleUpload
        }
        disabled={uploading}
        style={{
          display: "none",
        }}
      />

      <p
        style={{
          fontSize:
            "13px",
          color: "#777",
          marginTop:
            "10px",
        }}
      >
        JPG, PNG or WEBP
        <br />
        Maximum 3 MB
      </p>

      {error && (
        <p
          style={{
            color: "red",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}