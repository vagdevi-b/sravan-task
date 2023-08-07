export class BubbleChartDatasetModel {
  constructor(
    public data: object[],
    public borderColor: string[],
    public projectNames: string[],
    // public backgroundColor = 'rgba(255, 255, 255, 0.4)',
    public backgroundColor: string[],
    public borderWidth = 3,
    public hoverBorderWidth = 0
  ) { }
}