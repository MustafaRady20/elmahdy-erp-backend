import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RulesService } from './rules.service';
import { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto';
import { Rules } from './schema/rules.schema';

@ApiTags('Rules & Instructions')
@Controller('rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rule or instruction' })
  @ApiResponse({ status: 201, description: 'The rule/instruction has been successfully created.', type: Rules })
  async create(@Body() createRuleDto: CreateRuleDto): Promise<Rules> {
    return this.rulesService.create(createRuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rules and instructions' })
  @ApiResponse({ status: 200, description: 'List of rules and instructions', type: [Rules] })
  async findAll(): Promise<Rules[]> {
    return this.rulesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific rule or instruction by ID' })
  @ApiParam({ name: 'id', description: 'Rule ID' })
  @ApiResponse({ status: 200, description: 'The rule/instruction', type: Rules })
  async findOne(@Param('id') id: string): Promise<Rules> {
    return this.rulesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a rule or instruction' })
  @ApiParam({ name: 'id', description: 'Rule ID' })
  @ApiResponse({ status: 200, description: 'The updated rule/instruction', type: Rules })
  async update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto): Promise<Rules> {
    return this.rulesService.update(id, updateRuleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rule or instruction' })
  @ApiParam({ name: 'id', description: 'Rule ID' })
  @ApiResponse({ status: 200, description: 'Rule/instruction deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.rulesService.remove(id);
  }
}
