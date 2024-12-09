import { UploadOutlined } from "@ant-design/icons";
import { backupData, recoverData } from "@lib/backup.ts";
import { App, Button, Card, Upload } from "antd";
import type { FC } from "react";

const BackupPage: FC = () => {
  const { message } = App.useApp();
  
  const handleDownload = () => {
    const data = backupData();
    const filename = `daily-memory-backup-${new Date().toISOString()}.json`;
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const decoder = new TextDecoder();
      const data = decoder.decode(buffer);
      recoverData(data)
        .then(() => message.success("Data imported successfully"))
        .catch(() => message.error("Failed to import data"));
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col h-full items-center justify-center">
      <div className="flex flex-row gap-10">
        <Card title="Backup your data">
          <p>Your data are stored in your browser.</p>
          <p>
            <Button type="link" className="p-0" onClick={handleDownload}>
              Click here
            </Button>{" "}
            to export your data.
          </p>
        </Card>
        <Card title="Recover your data">
          <p>Recover your data from the exported file.</p>
          <div className="text-center mt-4">
            <Upload
              accept=".json"
              fileList={[]}
              beforeUpload={(file) => {
                handleUpload(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Click here to import your data</Button>
            </Upload>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BackupPage;
