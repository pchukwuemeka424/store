"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import SiteLogoModel from "@/components/siteLogoModel";
import Image from "next/image";
import AddMenu from "@/actions/auth/addMenu";
import { useActionState } from "react";

export default function SettingsPage({ userDetails, siteInfo }) {
  const [state, action, isPending] = useActionState(AddMenu, undefined);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <Card>
        <CardHeader>Site Logo</CardHeader>
        <CardContent className="flex items-center justify-center">
          <div>
            <Image
              src={siteInfo?.logo}
              alt="Site Logo"
              width={100}
              height={100}
              className="rounded-full my-2 border-s-orange-800"
            />
            <SiteLogoModel />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Menus</CardHeader>
        <CardContent>
          <div className="space-y-2">
            <form action={action}>
              <Input
                placeholder="Enter Menu Name"
                name="menu_name"
                type="text"
              />
              <Input
                placeholder="Enter Menu Link"
                name="menu_link"
                type="text"
              />
              <Button className="mt-2" type="submit" disabled={isPending}>
                <Plus className="w-4 h-4 mr-2" /> Add Menu
              </Button>
            </form>
          </div>
          <div className="mt-4">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Menu Name</th>
                  <th className="border border-gray-300 p-2">Hyperlink</th>
                  <th className="border border-gray-300 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">Home</td>
                  <td className="border border-gray-300 p-2">/home</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <Button variant="destructive" size="sm">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Banner</CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input placeholder="Banner Title" name="banner_title" type="text" />
            <Input
              placeholder="Banner Subtitle"
              name="banner_subtitle"
              type="text"
            />
            <input type="file" accept="image/*" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
