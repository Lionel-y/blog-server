import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: `
  SELECT TagMap.pid,GROUP_CONCAT(Tag.tag_name) as tags FROM tag_map TagMap LEFT JOIN tag Tag ON TagMap.tid=Tag.tid GROUP BY TagMap.pid
  `,
})
export class TagMapView {
  @ViewColumn()
  pid: string;

  @ViewColumn()
  tags: string;
}
