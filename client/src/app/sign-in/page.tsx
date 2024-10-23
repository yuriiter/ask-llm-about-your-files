"use client";

import React from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "../loading";
import Link from "next/link";

export default function SignInPage() {
  const session = useSession();
  const searchParams = useSearchParams();
  const redirectPathname = searchParams.get("redirect");
  const router = useRouter();

  if (session.status === "loading") return <Loading />;

  if (session.status === "authenticated") {
    router.replace("/files");
  }

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2">Welcome back</h2>
                  <p className="text-muted">Please sign in to continue</p>
                </div>

                <div className="d-grid gap-3">
                  <button
                    onClick={() =>
                      signIn("google", {
                        callbackUrl: redirectPathname ?? "/files",
                      })
                    }
                    className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2 py-2"
                  >
                    <svg
                      className="bi"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </button>
                </div>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    By continuing, you agree to our{" "}
                    <Link
                      href="/terms-of-service"
                      className="text-decoration-none"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-decoration-none"
                    >
                      Privacy Policy
                    </Link>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
