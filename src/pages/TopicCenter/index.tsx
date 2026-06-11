import MaterialCollection from './MaterialCollection';
import AudienceTagger from './AudienceTagger';
import AngleGenerator from './AngleGenerator';

export default function TopicCenter() {
  return (
    <div className="min-h-screen bg-paper-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-800 font-serif">选题中心</h1>
          <p className="text-sm text-ink-400 mt-1">
            收集素材、定义受众、生成角度，打造爆款选题
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <MaterialCollection />
          </div>
          <div className="col-span-4">
            <AudienceTagger />
          </div>
          <div className="col-span-4">
            <AngleGenerator />
          </div>
        </div>
      </div>
    </div>
  );
}
