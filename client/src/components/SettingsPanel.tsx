import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsPanelProps {
  hostname: string;
  timezone: string;
  onHostnameChange: (value: string) => void;
  onTimezoneChange: (value: string) => void;
}

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Australia/Sydney",
  "America/Sao_Paulo",
  "America/Argentina/Buenos_Aires",
];

export default function SettingsPanel({
  hostname,
  timezone,
  onHostnameChange,
  onTimezoneChange,
}: SettingsPanelProps) {
  return (
    <div className="space-y-4">
      {/* Hostname */}
      <div className="space-y-2">
        <Label htmlFor="hostname">Nome do Host</Label>
        <Input
          id="hostname"
          value={hostname}
          onChange={(e) => onHostnameChange(e.target.value)}
          placeholder="linux-system"
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Nome que será atribuído ao computador na rede
        </p>
      </div>

      {/* Timezone */}
      <div className="space-y-2">
        <Label htmlFor="timezone">Fuso Horário</Label>
        <Select value={timezone} onValueChange={onTimezoneChange}>
          <SelectTrigger id="timezone">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz} value={tz}>
                {tz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Fuso horário para a instalação
        </p>
      </div>
    </div>
  );
}
